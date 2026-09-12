import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { SalaryStructureWorkspaceEntity } from 'src/modules/hr/standard-objects/salaryStructure.workspace-entity';
import { SalaryComponentWorkspaceEntity } from 'src/modules/hr/standard-objects/salaryComponent.workspace-entity';
import { AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';
import { LeaveRequestWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveRequest.workspace-entity';
import { LeaveTypeWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveType.workspace-entity';
import { PayrollAdjustmentWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollAdjustment.workspace-entity';
import { PayslipWorkspaceEntity } from 'src/modules/hr/standard-objects/payslip.workspace-entity';
import { PayslipLineWorkspaceEntity } from 'src/modules/hr/standard-objects/payslipLine.workspace-entity';

export interface PayrollCalculationInput {
  employeeId: string;
  periodStartDate: Date;
  periodEndDate: Date;
  currency: string;
  workingDaysInMonth: number;
}

export interface PayslipCalculationResult {
  employeeId: string;
  currency: string;
  grossEarnings: number;
  totalDeductions: number;
  totalAdjustments: number;
  netPay: number;
  workingDays: number;
  presentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  overtimeMinutes: number;
  lines: Array<{
    label: string;
    lineType: 'EARNING' | 'DEDUCTION' | 'ADJUSTMENT';
    amount: number;
    position: number;
  }>;
  prorationFactor: number;
}

@Injectable()
export class PayrollCalculationService {
  private readonly logger = new Logger(PayrollCalculationService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  async calculatePayslip(
    input: PayrollCalculationInput,
    workspaceId: string,
  ): Promise<PayslipCalculationResult> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        const salaryStructureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
          );

        const salaryComponentRepository =
          this.workspaceOrmManager.getRepository<SalaryComponentWorkspaceEntity>(
            'salaryComponent',
          );

        const attendanceDayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
          );

        const leaveRequestRepository =
          this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>(
            'leaveRequest',
          );

        const leaveTypeRepository =
          this.workspaceOrmManager.getRepository<LeaveTypeWorkspaceEntity>(
            'leaveType',
          );

        const adjustmentRepository =
          this.workspaceOrmManager.getRepository<PayrollAdjustmentWorkspaceEntity>(
            'payrollAdjustment',
          );

        const employee = await employeeRepository.findOne({
          where: { id: input.employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${input.employeeId} not found`);
        }

        if (employee.status !== 'ACTIVE') {
          throw new Error(
            `Employee ${input.employeeId} is not active (status: ${employee.status})`,
          );
        }

        const structure = await this.getEffectiveSalaryStructure(
          input.employeeId,
          input.periodStartDate,
          salaryStructureRepository,
        );

        if (!structure) {
          throw new Error(
            `No salary structure found for employee ${input.employeeId} at ${input.periodStartDate.toISOString()}`,
          );
        }

        const components = await salaryComponentRepository.find({
          where: { salaryStructureId: structure.id },
        });

        const attendanceDays = await attendanceDayRepository.find({
          where: { employeeId: input.employeeId },
        });

        const periodDays = attendanceDays.filter((d) => {
          const workDate = new Date(d.workDate as unknown as string);
          return (
            workDate >= input.periodStartDate && workDate <= input.periodEndDate
          );
        });

        const presentDays = periodDays.filter(
          (d) => d.status === 'PRESENT' || d.status === 'LATE',
        ).length;

        const totalOvertimeMinutes = periodDays.reduce(
          (sum, d) => sum + (d.overtimeMinutes || 0),
          0,
        );

        const leaveRequests = await leaveRequestRepository.find({
          where: { employeeId: input.employeeId, status: 'APPROVED' },
        });

        let paidLeaveDays = 0;
        let unpaidLeaveDays = 0;

        for (const leave of leaveRequests) {
          if (!leave.startDate || !leave.endDate) continue;

          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);

          if (
            leaveStart <= input.periodEndDate &&
            leaveEnd >= input.periodStartDate
          ) {
            const overlapStart = new Date(
              Math.max(leaveStart.getTime(), input.periodStartDate.getTime()),
            );
            const overlapEnd = new Date(
              Math.min(leaveEnd.getTime(), input.periodEndDate.getTime()),
            );

            const days = this.daysBetween(overlapStart, overlapEnd);

            const leaveType = await leaveTypeRepository.findOne({
              where: { id: leave.leaveTypeId },
            });

            if (leaveType?.isPaid) {
              paidLeaveDays += days;
            } else {
              unpaidLeaveDays += days;
            }
          }
        }

        const prorationFactor = this.calculateProration(
          employee.joiningDate,
          employee.exitDate,
          input.periodStartDate,
          input.periodEndDate,
          input.workingDaysInMonth,
        );

        const lines: PayslipCalculationResult['lines'] = [];
        let linePosition = 0;

        for (const comp of components) {
          if (comp.componentType === 'EARNING') {
            let amount = 0;

            if (comp.calculationType === 'FIXED') {
              amount = (comp.amount as unknown as number) || 0;
            } else if (comp.calculationType === 'PERCENTAGE') {
              amount =
                (((structure.monthlyGross as unknown as number) || 0) * (comp.percentage || 0)) / 100;
            }

            amount = this.roundToTwo(amount * prorationFactor);

            lines.push({
              label: comp.name || 'Earning',
              lineType: 'EARNING',
              amount,
              position: linePosition++,
            });
          }
        }

        for (const comp of components) {
          if (comp.componentType === 'DEDUCTION') {
            let amount = 0;

            if (comp.calculationType === 'FIXED') {
              amount = (comp.amount as unknown as number) || 0;
            } else if (comp.calculationType === 'PERCENTAGE') {
              amount =
                (((structure.monthlyGross as unknown as number) || 0) * (comp.percentage || 0)) / 100;
            }

            amount = this.roundToTwo(amount * prorationFactor);

            lines.push({
              label: comp.name || 'Deduction',
              lineType: 'DEDUCTION',
              amount,
              position: linePosition++,
            });
          }
        }

        if (unpaidLeaveDays > 0) {
          const perDaySalary = ((structure.monthlyGross as unknown as number) || 0) / input.workingDaysInMonth;
          const unpaidDeduction = this.roundToTwo(perDaySalary * unpaidLeaveDays);

          lines.push({
            label: `Unpaid Leave (${unpaidLeaveDays} days)`,
            lineType: 'DEDUCTION',
            amount: unpaidDeduction,
            position: linePosition++,
          });
        }

        const adjustments = await adjustmentRepository.find({
          where: { employeeId: input.employeeId, status: 'APPROVED' },
        });

        for (const adj of adjustments) {
          const adjDate = new Date(adj.createdAt);
          if (
            adjDate >= input.periodStartDate &&
            adjDate <= input.periodEndDate
          ) {
            const amount = (adj.amount as unknown as number) || 0;

            lines.push({
              label: adj.reason || 'Adjustment',
              lineType: 'ADJUSTMENT',
              amount,
              position: linePosition++,
            });
          }
        }

        const grossEarnings = lines
          .filter((l) => l.lineType === 'EARNING')
          .reduce((sum, l) => sum + l.amount, 0);

        const totalDeductions = lines
          .filter((l) => l.lineType === 'DEDUCTION')
          .reduce((sum, l) => sum + l.amount, 0);

        const totalAdjustments = lines
          .filter((l) => l.lineType === 'ADJUSTMENT')
          .reduce((sum, l) => sum + l.amount, 0);

        const netPay = this.roundToTwo(
          grossEarnings - totalDeductions + totalAdjustments,
        );

        return {
          employeeId: input.employeeId,
          currency: input.currency,
          grossEarnings,
          totalDeductions,
          totalAdjustments,
          netPay,
          workingDays: input.workingDaysInMonth,
          presentDays,
          paidLeaveDays,
          unpaidLeaveDays,
          overtimeMinutes: totalOvertimeMinutes,
          lines,
          prorationFactor,
        };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async savePayslip(
    calculation: PayslipCalculationResult,
    payrollPeriodId: string,
    workspaceId: string,
  ): Promise<PayslipWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
            { shouldBypassPermissionChecks: true },
          );

        const payslipLineRepository =
          this.workspaceOrmManager.getRepository<PayslipLineWorkspaceEntity>(
            'payslipLine',
            { shouldBypassPermissionChecks: true },
          );

        const payslip = (await payslipRepository.save({
          employeeId: calculation.employeeId,
          payrollPeriodId,
          currency: calculation.currency,
          grossEarnings: calculation.grossEarnings,
          totalDeductions: calculation.totalDeductions,
          totalAdjustments: calculation.totalAdjustments,
          netPay: calculation.netPay,
          workingDays: calculation.workingDays,
          presentDays: calculation.presentDays,
          paidLeaveDays: calculation.paidLeaveDays,
          unpaidLeaveDays: calculation.unpaidLeaveDays,
          overtimeMinutes: calculation.overtimeMinutes,
          paymentStatus: 'UNPAID',
        } as unknown as Partial<PayslipWorkspaceEntity>)) as unknown as PayslipWorkspaceEntity;

        for (const line of calculation.lines) {
          await payslipLineRepository.save({
            payslipId: payslip.id,
            label: line.label,
            lineType: line.lineType,
            amount: line.amount,
            position: line.position,
          } as unknown as Partial<PayslipLineWorkspaceEntity>);
        }

        return payslip;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async validatePayrollPreflight(
    employeeIds: string[],
    periodStartDate: Date,
    periodEndDate: Date,
    workspaceId: string,
  ): Promise<{
    ready: string[];
    issues: Array<{
      employeeId: string;
      issue: string;
      severity: 'ERROR' | 'WARNING';
    }>;
  }> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        const salaryStructureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
          );

        const attendanceDayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
          );

        const ready: string[] = [];
        const issues: Array<{
          employeeId: string;
          issue: string;
          severity: 'ERROR' | 'WARNING';
        }> = [];

        for (const employeeId of employeeIds) {
          const employee = await employeeRepository.findOne({
            where: { id: employeeId },
          });

          if (!employee) {
            issues.push({
              employeeId,
              issue: 'Employee not found',
              severity: 'ERROR',
            });
            continue;
          }

          if (employee.status !== 'ACTIVE') {
            issues.push({
              employeeId,
              issue: `Employee is ${employee.status}, not ACTIVE`,
              severity: 'WARNING',
            });
          }

          if (!employee.joiningDate) {
            issues.push({
              employeeId,
              issue: 'Missing joining date',
              severity: 'ERROR',
            });
          }

          const structure = await salaryStructureRepository.findOne({
            where: { employeeId, isActive: true },
          });

          if (!structure) {
            issues.push({
              employeeId,
              issue: 'No active salary structure',
              severity: 'ERROR',
            });
            continue;
          }

          if (!(structure.monthlyGross as unknown as number) || (structure.monthlyGross as unknown as number) <= 0) {
            issues.push({
              employeeId,
              issue: 'Salary structure has no monthly gross defined',
              severity: 'ERROR',
            });
          }

          const attendanceDays = await attendanceDayRepository.find({
            where: { employeeId },
          });

          const periodDays = attendanceDays.filter((d) => {
            const workDate = new Date(d.workDate as unknown as string);
            return (
              workDate >= periodStartDate && workDate <= periodEndDate
            );
          });

          if (periodDays.length === 0) {
            issues.push({
              employeeId,
              issue: 'No attendance records for this period',
              severity: 'WARNING',
            });
          }

          const joiningDate = new Date(employee.joiningDate as unknown as string);
          if (joiningDate > periodStartDate && joiningDate <= periodEndDate) {
            issues.push({
              employeeId,
              issue: `Mid-month join on ${joiningDate.toISOString().split('T')[0]}`,
              severity: 'WARNING',
            });
          }

          if (employee.exitDate) {
            const exitDate = new Date(employee.exitDate);
            if (
              exitDate >= periodStartDate &&
              exitDate <= periodEndDate
            ) {
              issues.push({
                employeeId,
                issue: `Mid-month exit on ${exitDate.toISOString().split('T')[0]}`,
                severity: 'WARNING',
              });
            }
          }

          if (
            !issues.some(
              (i) => i.employeeId === employeeId && i.severity === 'ERROR',
            )
          ) {
            ready.push(employeeId);
          }
        }

        return { ready, issues };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private async getEffectiveSalaryStructure(
    employeeId: string,
    date: Date,
    repository: any,
  ): Promise<SalaryStructureWorkspaceEntity | null> {
    const structures = await repository.find({
      where: { employeeId },
      order: { effectiveFrom: 'DESC' },
    });

    for (const structure of structures) {
      const effectiveFrom = new Date(structure.effectiveFrom);
      if (effectiveFrom <= date) {
        if (
          !structure.effectiveTo ||
          new Date(structure.effectiveTo) >= date
        ) {
          return structure;
        }
      }
    }

    return null;
  }

  private calculateProration(
    joiningDate: Date | null,
    exitDate: Date | null,
    periodStartDate: Date,
    periodEndDate: Date,
    workingDaysInMonth: number,
  ): number {
    if (!joiningDate) return 1;

    const join = new Date(joiningDate);
    const effectiveStart = new Date(Math.max(join.getTime(), periodStartDate.getTime()));

    const effectiveEnd = exitDate
      ? new Date(Math.min(new Date(exitDate).getTime(), periodEndDate.getTime()))
      : periodEndDate;

    const workingDays = this.daysBetween(effectiveStart, effectiveEnd);

    return workingDaysInMonth > 0 ? workingDays / workingDaysInMonth : 1;
  }

  // Counts inclusive calendar days, ignoring the time of day. Payroll periods
  // arrive with an end-of-day timestamp, so a raw millisecond diff overstated
  // every full-month proration by one day (32/31 instead of 1).
  private daysBetween(start: Date, end: Date): number {
    const startDay = Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
    );
    const endDay = Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
    );

    return Math.round((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1;
  }

  private roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }
}
