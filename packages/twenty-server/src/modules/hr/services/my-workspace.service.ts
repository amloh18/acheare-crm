import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { AnnouncementWorkspaceEntity } from 'src/modules/hr/standard-objects/announcement.workspace-entity';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';
import { LeaveRequestWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveRequest.workspace-entity';
import { LeaveBalanceWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveBalance.workspace-entity';
import { PayslipWorkspaceEntity } from 'src/modules/hr/standard-objects/payslip.workspace-entity';

export interface MyWorkspaceData {
  employee: EmployeeWorkspaceEntity | null;
  attendanceToday: AttendanceDayWorkspaceEntity | null;
  pendingLeaveRequests: LeaveRequestWorkspaceEntity[];
  leaveBalances: LeaveBalanceWorkspaceEntity[];
  recentPayslips: PayslipWorkspaceEntity[];
  announcements: AnnouncementWorkspaceEntity[];
  stats: {
    pendingTasks: number;
    unreadNotifications: number;
    upcomingLeave: number;
  };
}

@Injectable()
export class MyWorkspaceService {
  private readonly logger = new Logger(MyWorkspaceService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async getMyWorkspaceData(
    userId: string,
    workspaceId: string,
  ): Promise<MyWorkspaceData> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const safeGetRepository = <T>(name: string) => {
          try {
            return this.workspaceOrmManager.getRepository<T>(name);
          } catch {
            return null;
          }
        };

        const employeeRepository =
          safeGetRepository<EmployeeWorkspaceEntity>('employee');
        const attendanceRepository =
          safeGetRepository<AttendanceDayWorkspaceEntity>('attendanceDay');
        const leaveRequestRepository =
          safeGetRepository<LeaveRequestWorkspaceEntity>('leaveRequest');
        const leaveBalanceRepository =
          safeGetRepository<LeaveBalanceWorkspaceEntity>('leaveBalance');
        const payslipRepository =
          safeGetRepository<PayslipWorkspaceEntity>('payslip');
        const announcementRepository =
          safeGetRepository<AnnouncementWorkspaceEntity>('announcement');

        let employee: EmployeeWorkspaceEntity | null = null;
        if (employeeRepository) {
          try {
            employee = await employeeRepository.findOne({
              where: { personId: userId },
            });
          } catch (e) {
            this.logger.warn(`Failed to query employee: ${e}`);
          }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendanceToday: AttendanceDayWorkspaceEntity | null = null;
        if (employee && attendanceRepository) {
          try {
            attendanceToday = await attendanceRepository.findOne({
              where: { employeeId: employee.id, workDate: today },
            });
          } catch (e) {
            this.logger.warn(`Failed to query attendanceDay: ${e}`);
          }
        }

        let pendingLeaveRequests: LeaveRequestWorkspaceEntity[] = [];
        if (employee && leaveRequestRepository) {
          try {
            pendingLeaveRequests = await leaveRequestRepository.find({
              where: {
                employeeId: employee.id,
                status: 'PENDING',
              },
            });
          } catch (e) {
            this.logger.warn(`Failed to query leaveRequest: ${e}`);
          }
        }

        const currentYear = new Date().getFullYear();
        let leaveBalances: LeaveBalanceWorkspaceEntity[] = [];
        if (employee && leaveBalanceRepository) {
          try {
            leaveBalances = await leaveBalanceRepository.find({
              where: { employeeId: employee.id, year: currentYear },
            });
          } catch (e) {
            this.logger.warn(`Failed to query leaveBalance: ${e}`);
          }
        }

        let recentPayslips: PayslipWorkspaceEntity[] = [];
        if (employee && payslipRepository) {
          try {
            recentPayslips = await payslipRepository.find({
              where: { employeeId: employee.id },
            });
          } catch (e) {
            this.logger.warn(`Failed to query payslip: ${e}`);
          }
        }

        let announcements: AnnouncementWorkspaceEntity[] = [];
        if (announcementRepository) {
          try {
            announcements = await announcementRepository.find({
              where: { isPublished: true },
            });
          } catch (e) {
            this.logger.warn(`Failed to query announcement: ${e}`);
          }
        }

        const activeAnnouncements = announcements.filter((a) => {
          if (a.expiresAt && new Date(a.expiresAt) < today) {
            return false;
          }
          if (a.publishAt && new Date(a.publishAt) > today) {
            return false;
          }
          return true;
        });

        return {
          employee,
          attendanceToday,
          pendingLeaveRequests,
          leaveBalances,
          recentPayslips: recentPayslips.slice(0, 5),
          announcements: activeAnnouncements.slice(0, 10),
          stats: {
            pendingTasks: 0,
            unreadNotifications: 0,
            upcomingLeave: pendingLeaveRequests.length,
          },
        };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async publishAnnouncement(
    title: string,
    body: string,
    authorId: string,
    audience: string,
    targetDepartmentIds?: string[],
    targetTeamIds?: string[],
    expiresAt?: Date,
    workspaceId?: string,
  ): Promise<AnnouncementWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const announcementRepository =
          this.workspaceOrmManager.getRepository<AnnouncementWorkspaceEntity>(
            'announcement',
            { shouldBypassPermissionChecks: true },
          );

        const announcement = (await announcementRepository.save({
          title,
          body,
          authorId,
          audience,
          targetDepartmentIds: targetDepartmentIds || null,
          targetTeamIds: targetTeamIds || null,
          publishAt: new Date(),
          expiresAt: expiresAt || null,
          isPublished: true,
        } as Partial<AnnouncementWorkspaceEntity>)) as unknown as AnnouncementWorkspaceEntity;

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'announcement_published',
          [{ announcementId: announcement.id, workspaceId }],
          workspaceId,
        );

        return announcement;
      },
      buildSystemAuthContext(workspaceId!),
    );
  }

  async getAnnouncementsForEmployee(
    employeeId: string,
    workspaceId: string,
  ): Promise<AnnouncementWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        let announcementRepository: any = null;
        try {
          announcementRepository =
            this.workspaceOrmManager.getRepository<AnnouncementWorkspaceEntity>(
              'announcement',
            );
        } catch {
          return [];
        }

        let employeeRepository: any = null;
        try {
          employeeRepository =
            this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
              'employee',
            );
        } catch {
          return [];
        }

        const employee = await employeeRepository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          return [];
        }

        const allAnnouncements = await announcementRepository.find({
          where: { isPublished: true },
        });

        const now = new Date();

        return allAnnouncements.filter((a) => {
          if (a.expiresAt && new Date(a.expiresAt) < now) return false;
          if (a.publishAt && new Date(a.publishAt) > now) return false;

          if (a.audience === 'ALL') return true;

          if (
            a.audience === 'DEPARTMENT' &&
            a.targetDepartmentIds?.includes(employee.departmentId || '')
          ) {
            return true;
          }

          if (
            a.audience === 'TEAM' &&
            a.targetTeamIds?.includes(employee.teamId || '')
          ) {
            return true;
          }

          return false;
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
