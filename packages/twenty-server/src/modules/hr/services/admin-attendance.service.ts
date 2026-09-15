import { Injectable } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';
import { LeaveRequestWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveRequest.workspace-entity';
import { LeaveTypeWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveType.workspace-entity';
import { DepartmentWorkspaceEntity } from 'src/modules/hr/standard-objects/department.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@Injectable()
export class AdminAttendanceService {
  constructor(private readonly workspaceOrmManager: WorkspaceOrmManager) {}

  async getAllEmployeesAttendance(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    departmentId?: string,
    status?: string,
  ) {
    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const employeeRepo = this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>('employee');
      const attendanceDayRepo = this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>('attendanceDay');
      const departmentRepo = this.workspaceOrmManager.getRepository<DepartmentWorkspaceEntity>('department');
      const personRepo = this.workspaceOrmManager.getRepository<PersonWorkspaceEntity>('person');

      const whereConditions: any = {};
      if (departmentId) {
        whereConditions.departmentId = departmentId;
      }

      const employees = await employeeRepo.find({
        where: whereConditions,
        relations: ['person', 'department'],
      });

      const employeeIds = employees.map((e) => e.id);

      const attendanceDays = await attendanceDayRepo.find({
        where: {
          employeeId: { $in: employeeIds } as any,
          workDate: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          } as any,
        },
      });

      const dayMap = new Map<string, AttendanceDayWorkspaceEntity[]>();
      for (const day of attendanceDays) {
        const existing = dayMap.get(day.employeeId ?? '') || [];
        existing.push(day);
        dayMap.set(day.employeeId ?? '', existing);
      }

      const employeesWithAttendance = await Promise.all(
        employees.map(async (employee) => {
          let personName = 'Unknown';
          let initials = '??';

          if (employee.personId) {
            const person = await personRepo.findOne({
              where: { id: employee.personId },
            });
            if (person) {
              const firstName = (person as any).firstName ?? '';
              const lastName = (person as any).lastName ?? '';
              personName = `${firstName} ${lastName}`.trim() || 'Unknown';
              initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '??';
            }
          }

          let departmentName = null;
          if (employee.departmentId) {
            const dept = await departmentRepo.findOne({
              where: { id: employee.departmentId },
            });
            departmentName = dept ? (dept as any).name ?? null : null;
          }

          const empDays = dayMap.get(employee.id) || [];
          const days = this.buildWeekDays(empDays, startDate, endDate);

          return {
            employeeId: employee.id,
            name: personName,
            role: (employee as any).employmentType ?? null,
            initials,
            departmentId: employee.departmentId ?? null,
            departmentName,
            days,
          };
        }),
      );

      const summary = this.calculateSummary(employeesWithAttendance);

      return {
        ...summary,
        employees: employeesWithAttendance,
      };
    }, buildSystemAuthContext(workspaceId));
  }

  private buildWeekDays(
    attendanceDays: AttendanceDayWorkspaceEntity[],
    startDate: Date,
    endDate: Date,
  ) {
    const days: Array<{
      day: number;
      status: string | null;
      hours: string | null;
      workedMinutes: number | null;
      lateMinutes: number | null;
    }> = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfMonth = currentDate.getDate();
      const dayRecord = attendanceDays.find((d) => {
        const workDate = new Date(d.workDate as unknown as string);
        return workDate.getDate() === dayOfMonth;
      });

      if (dayRecord) {
        const workedMinutes = dayRecord.workedMinutes ?? 0;
        const hours = Math.floor(workedMinutes / 60);
        const minutes = workedMinutes % 60;
        const hoursStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        days.push({
          day: dayOfMonth,
          status: (dayRecord.status ?? 'ABSENT').toLowerCase(),
          hours: dayRecord.status === 'ABSENT' ? 'Absent' :
                 dayRecord.status === 'LEAVE' ? 'Leave' :
                 dayRecord.status === 'LATE' ? hoursStr :
                 hoursStr,
          workedMinutes,
          lateMinutes: dayRecord.lateMinutes ?? 0,
        });
      } else {
        days.push({
          day: dayOfMonth,
          status: null,
          hours: null,
          workedMinutes: null,
          lateMinutes: null,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }

  private calculateSummary(employees: any[]) {
    let presentToday = 0;
    let lateEntry = 0;
    let onLeave = 0;
    let absent = 0;

    for (const emp of employees) {
      const today = emp.days.find((d: any) => d.status);
      if (today) {
        switch (today.status) {
          case 'present':
            presentToday++;
            break;
          case 'late':
            lateEntry++;
            break;
          case 'leave':
            onLeave++;
            break;
          case 'absent':
            absent++;
            break;
        }
      }
    }

    return {
      presentToday,
      lateEntry,
      onLeave,
      absent,
      totalEmployees: employees.length,
    };
  }

  async getAllLeaveRequests(
    workspaceId: string,
    status?: string,
    employeeId?: string,
    leaveTypeId?: string,
  ) {
    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const leaveRequestRepo = this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>('leaveRequest');
      const leaveTypeRepo = this.workspaceOrmManager.getRepository<LeaveTypeWorkspaceEntity>('leaveType');
      const employeeRepo = this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>('employee');
      const personRepo = this.workspaceOrmManager.getRepository<PersonWorkspaceEntity>('person');

      const whereConditions: any = {};
      if (status) whereConditions.status = status;
      if (employeeId) whereConditions.employeeId = employeeId;
      if (leaveTypeId) whereConditions.leaveTypeId = leaveTypeId;

      const requests = await leaveRequestRepo.find({
        where: whereConditions,
        order: { createdAt: 'DESC' },
      });

      const requestsWithDetails = await Promise.all(
        requests.map(async (req) => {
          let employeeName = 'Unknown';
          if (req.employeeId) {
            const employee = await employeeRepo.findOne({
              where: { id: req.employeeId },
            });
            if (employee?.personId) {
              const person = await personRepo.findOne({
                where: { id: employee.personId },
              });
              if (person) {
                const firstName = (person as any).firstName ?? '';
                const lastName = (person as any).lastName ?? '';
                employeeName = `${firstName} ${lastName}`.trim() || 'Unknown';
              }
            }
          }

          let leaveTypeName = 'Unknown';
          if (req.leaveTypeId) {
            const leaveType = await leaveTypeRepo.findOne({
              where: { id: req.leaveTypeId },
            });
            leaveTypeName = leaveType ? (leaveType as any).name ?? 'Unknown' : 'Unknown';
          }

          return {
            id: req.id,
            employeeId: req.employeeId ?? '',
            employeeName,
            leaveTypeId: req.leaveTypeId ?? null,
            leaveTypeName,
            startDate: req.startDate ? new Date(req.startDate as unknown as string).toISOString() : '',
            endDate: req.endDate ? new Date(req.endDate as unknown as string).toISOString() : '',
            days: req.days ?? 0,
            reason: req.reason ?? '',
            status: req.status ?? 'PENDING',
            reviewedAt: req.reviewedAt
              ? new Date(req.reviewedAt as unknown as string).toISOString()
              : null,
            reviewNotes: req.reviewNotes ?? null,
          };
        }),
      );

      const pendingCount = requestsWithDetails.filter((r) => r.status === 'PENDING').length;
      const approvedCount = requestsWithDetails.filter((r) => r.status === 'APPROVED').length;
      const rejectedCount = requestsWithDetails.filter((r) => r.status === 'REJECTED').length;

      return {
        requests: requestsWithDetails,
        totalCount: requestsWithDetails.length,
        pendingCount,
        approvedCount,
        rejectedCount,
      };
    }, buildSystemAuthContext(workspaceId));
  }

  async getLeaveTypes(workspaceId: string) {
    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const leaveTypeRepo = this.workspaceOrmManager.getRepository<LeaveTypeWorkspaceEntity>('leaveType');

      const types = await leaveTypeRepo.find({
        where: { isActive: true },
      });

      return types.map((t) => ({
        id: t.id,
        name: (t as any).name ?? '',
        isPaid: (t as any).isPaid ?? true,
        annualQuota: (t as any).annualQuota ?? 0,
        isActive: (t as any).isActive ?? true,
      }));
    }, buildSystemAuthContext(workspaceId));
  }

  async getLeaveBalance(workspaceId: string, employeeId: string, year: number) {
    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const leaveBalanceRepo = this.workspaceOrmManager.getRepository('leaveBalance');
      const leaveTypeRepo = this.workspaceOrmManager.getRepository<LeaveTypeWorkspaceEntity>('leaveType');

      const balances = await leaveBalanceRepo.find({
        where: { employeeId, year },
      });

      const balancesWithTypes = await Promise.all(
        balances.map(async (balance: any) => {
          let leaveTypeName = 'Unknown';
          if (balance.leaveTypeId) {
            const leaveType = await leaveTypeRepo.findOne({
              where: { id: balance.leaveTypeId },
            });
            leaveTypeName = leaveType ? (leaveType as any).name ?? 'Unknown' : 'Unknown';
          }

          return {
            id: balance.id,
            leaveTypeId: balance.leaveTypeId ?? '',
            leaveTypeName,
            year: balance.year ?? year,
            entitled: balance.entitled ?? 0,
            used: balance.used ?? 0,
            pending: balance.pending ?? 0,
            available: (balance.entitled ?? 0) - (balance.used ?? 0) - (balance.pending ?? 0),
          };
        }),
      );

      return balancesWithTypes;
    }, buildSystemAuthContext(workspaceId));
  }
}
