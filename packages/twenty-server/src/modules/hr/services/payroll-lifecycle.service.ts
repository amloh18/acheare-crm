import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { PayrollPeriodWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollPeriod.workspace-entity';
import { PayslipWorkspaceEntity } from 'src/modules/hr/standard-objects/payslip.workspace-entity';
import { PayrollCalculationService } from 'src/modules/hr/services/payroll-calculation.service';

export enum PayrollPeriodStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  LOCKED = 'LOCKED',
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  [PayrollPeriodStatus.DRAFT]: [PayrollPeriodStatus.CALCULATED],
  [PayrollPeriodStatus.CALCULATED]: [PayrollPeriodStatus.UNDER_REVIEW],
  [PayrollPeriodStatus.UNDER_REVIEW]: [
    PayrollPeriodStatus.APPROVED,
    PayrollPeriodStatus.CALCULATED,
  ],
  [PayrollPeriodStatus.APPROVED]: [PayrollPeriodStatus.PAID],
  [PayrollPeriodStatus.PAID]: [PayrollPeriodStatus.LOCKED],
  [PayrollPeriodStatus.LOCKED]: [],
};

@Injectable()
export class PayrollLifecycleService {
  private readonly logger = new Logger(PayrollLifecycleService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
    private readonly payrollCalculationService: PayrollCalculationService,
  ) {}

  async createPayrollPeriod(
    name: string,
    startDate: Date,
    endDate: Date,
    payDate: Date,
    workspaceId: string,
  ): Promise<PayrollPeriodWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const periodRepository =
          this.workspaceOrmManager.getRepository<PayrollPeriodWorkspaceEntity>(
            'payrollPeriod',
            { shouldBypassPermissionChecks: true },
          );

        return (await periodRepository.save({
          name,
          startDate,
          endDate,
          payDate,
          status: PayrollPeriodStatus.DRAFT,
          employeeCount: 0,
          totalGross: 0,
          totalDeductions: 0,
          totalAdjustments: 0,
          totalNet: 0,
        } as unknown as Partial<PayrollPeriodWorkspaceEntity>)) as unknown as PayrollPeriodWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async transitionPeriodStatus(
    periodId: string,
    newStatus: PayrollPeriodStatus,
    workspaceId: string,
  ): Promise<PayrollPeriodWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const periodRepository =
          this.workspaceOrmManager.getRepository<PayrollPeriodWorkspaceEntity>(
            'payrollPeriod',
            { shouldBypassPermissionChecks: true },
          );

        const period = await periodRepository.findOne({
          where: { id: periodId },
        });

        if (!period) {
          throw new Error(`Payroll period ${periodId} not found`);
        }

        const currentStatus = period.status;
        const allowed = VALID_TRANSITIONS[currentStatus || ''] || [];

        if (!allowed.includes(newStatus)) {
          throw new Error(
            `Invalid status transition: ${currentStatus} -> ${newStatus}. Allowed: ${allowed.join(', ')}`,
          );
        }

        const updated = (await periodRepository.save({
          ...period,
          status: newStatus,
        } as Partial<PayrollPeriodWorkspaceEntity>)) as unknown as PayrollPeriodWorkspaceEntity;

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'payroll_periodStatusChanged',
          [
            {
              periodId: updated.id,
              fromStatus: currentStatus,
              toStatus: newStatus,
              workspaceId,
            },
          ],
          workspaceId,
        );

        return updated;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async calculatePayroll(
    periodId: string,
    employeeIds: string[],
    workspaceId: string,
  ): Promise<{
    period: PayrollPeriodWorkspaceEntity;
    payslipsCreated: number;
    errors: Array<{ employeeId: string; error: string }>;
  }> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const periodRepository =
          this.workspaceOrmManager.getRepository<PayrollPeriodWorkspaceEntity>(
            'payrollPeriod',
            { shouldBypassPermissionChecks: true },
          );

        const period = await periodRepository.findOne({
          where: { id: periodId },
        });

        if (!period) {
          throw new Error(`Payroll period ${periodId} not found`);
        }

        if (period.status !== PayrollPeriodStatus.DRAFT) {
          throw new Error(
            `Payroll period must be in DRAFT status to calculate. Current: ${period.status}`,
          );
        }

        const preflight =
          await this.payrollCalculationService.validatePayrollPreflight(
            employeeIds,
            new Date(period.startDate as unknown as string),
            new Date(period.endDate as unknown as string),
            workspaceId,
          );

        let payslipsCreated = 0;
        const errors: Array<{ employeeId: string; error: string }> = [];

        for (const employeeId of preflight.ready) {
          try {
            const calculation =
              await this.payrollCalculationService.calculatePayslip(
                {
                  employeeId,
                  periodStartDate: new Date(period.startDate as unknown as string),
                  periodEndDate: new Date(period.endDate as unknown as string),
                  currency: 'INR',
                  workingDaysInMonth: 30,
                },
                workspaceId,
              );

            await this.payrollCalculationService.savePayslip(
              calculation,
              periodId,
              workspaceId,
            );

            payslipsCreated++;
          } catch (error) {
            errors.push({
              employeeId,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        for (const issue of preflight.issues) {
          if (!errors.some((e) => e.employeeId === issue.employeeId)) {
            errors.push({
              employeeId: issue.employeeId,
              error: issue.issue,
            });
          }
        }

        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
            { shouldBypassPermissionChecks: true },
          );

        const payslips = await payslipRepository.find({
          where: { payrollPeriodId: periodId },
        });

        const totalGross = payslips.reduce(
          (sum: number, p: PayslipWorkspaceEntity) => sum + ((p.grossEarnings as unknown as number) || 0),
          0,
        );
        const totalDeductions = payslips.reduce(
          (sum: number, p: PayslipWorkspaceEntity) => sum + ((p.totalDeductions as unknown as number) || 0),
          0,
        );
        const totalAdjustments = payslips.reduce(
          (sum: number, p: PayslipWorkspaceEntity) => sum + ((p.totalAdjustments as unknown as number) || 0),
          0,
        );
        const totalNet = payslips.reduce(
          (sum: number, p: PayslipWorkspaceEntity) => sum + ((p.netPay as unknown as number) || 0),
          0,
        );

        const updated = (await periodRepository.save({
          ...period,
          status: PayrollPeriodStatus.CALCULATED,
          employeeCount: payslipsCreated,
          totalGross,
          totalDeductions,
          totalAdjustments,
          totalNet,
        } as unknown as Partial<PayrollPeriodWorkspaceEntity>)) as unknown as PayrollPeriodWorkspaceEntity;

        return { period: updated, payslipsCreated, errors };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async approvePayroll(
    periodId: string,
    approverId: string,
    workspaceId: string,
  ): Promise<PayrollPeriodWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const period =
          await this.transitionPeriodStatus(
            periodId,
            PayrollPeriodStatus.APPROVED,
            workspaceId,
          );

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'payroll_approved',
          [
            {
              periodId,
              approverId,
              workspaceId,
            },
          ],
          workspaceId,
        );

        return period;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async lockPayroll(
    periodId: string,
    workspaceId: string,
  ): Promise<PayrollPeriodWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const period =
          await this.transitionPeriodStatus(
            periodId,
            PayrollPeriodStatus.LOCKED,
            workspaceId,
          );

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'payroll_locked',
          [{ periodId, workspaceId }],
          workspaceId,
        );

        return period;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async markPayslipPaid(
    payslipId: string,
    paymentMethod: string,
    paymentReference: string,
    workspaceId: string,
  ): Promise<PayslipWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
            { shouldBypassPermissionChecks: true },
          );

        const payslip = await payslipRepository.findOne({
          where: { id: payslipId },
        });

        if (!payslip) {
          throw new Error(`Payslip ${payslipId} not found`);
        }

        return (await payslipRepository.save({
          ...payslip,
          paymentStatus: 'PAID',
          paidAt: new Date(),
          paymentMethod,
          paymentReference,
        } as Partial<PayslipWorkspaceEntity>)) as unknown as PayslipWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async markAllPayslipsPaid(
    periodId: string,
    paymentMethod: string,
    workspaceId: string,
  ): Promise<number> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
            { shouldBypassPermissionChecks: true },
          );

        const unpaidPayslips = await payslipRepository.find({
          where: {
            payrollPeriodId: periodId,
            paymentStatus: 'UNPAID',
          },
        });

        for (const payslip of unpaidPayslips) {
          await payslipRepository.save({
            ...payslip,
            paymentStatus: 'PAID',
            paidAt: new Date(),
            paymentMethod,
          } as Partial<PayslipWorkspaceEntity>);
        }

        await this.transitionPeriodStatus(
          periodId,
          PayrollPeriodStatus.PAID,
          workspaceId,
        );

        return unpaidPayslips.length;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getPayslipsForPeriod(
    periodId: string,
    workspaceId: string,
  ): Promise<PayslipWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
          );

        return payslipRepository.find({
          where: { payrollPeriodId: periodId },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getEmployeePayslips(
    employeeId: string,
    workspaceId: string,
  ): Promise<PayslipWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
          );

        return payslipRepository.find({
          where: { employeeId },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
