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
        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        const attendanceRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
          );

        const leaveRequestRepository =
          this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>(
            'leaveRequest',
          );

        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
          );

        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
          );

        const announcementRepository =
          this.workspaceOrmManager.getRepository<AnnouncementWorkspaceEntity>(
            'announcement',
          );

        const employee = await employeeRepository.findOne({
          where: { personId: userId },
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendanceToday = employee
          ? await attendanceRepository.findOne({
              where: { employeeId: employee.id, workDate: today },
            })
          : null;

        const pendingLeaveRequests = employee
          ? await leaveRequestRepository.find({
              where: {
                employeeId: employee.id,
                status: 'PENDING',
              },
            })
          : [];

        const currentYear = new Date().getFullYear();
        const leaveBalances = employee
          ? await leaveBalanceRepository.find({
              where: { employeeId: employee.id, year: currentYear },
            })
          : [];

        const recentPayslips = employee
          ? await payslipRepository.find({
              where: { employeeId: employee.id },
            })
          : [];

        const announcements = await announcementRepository.find({
          where: { isPublished: true },
        });

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
        const announcementRepository =
          this.workspaceOrmManager.getRepository<AnnouncementWorkspaceEntity>(
            'announcement',
          );

        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

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
