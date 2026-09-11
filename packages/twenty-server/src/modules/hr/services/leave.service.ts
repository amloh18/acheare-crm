import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { LeaveRequestWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveRequest.workspace-entity';
import { LeaveBalanceWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveBalance.workspace-entity';
import { LeaveTypeWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveType.workspace-entity';
import { AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';

export enum LeaveRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Injectable()
export class LeaveService {
  private readonly logger = new Logger(LeaveService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async requestLeave(
    employeeId: string,
    leaveTypeId: string,
    startDate: Date,
    endDate: Date,
    reason: string,
    workspaceId: string,
  ): Promise<LeaveRequestWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const leaveRequestRepository =
          this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>(
            'leaveRequest',
            { shouldBypassPermissionChecks: true },
          );

        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
            { shouldBypassPermissionChecks: true },
          );

        const leaveTypeRepository =
          this.workspaceOrmManager.getRepository<LeaveTypeWorkspaceEntity>(
            'leaveType',
            { shouldBypassPermissionChecks: true },
          );

        const leaveType = await leaveTypeRepository.findOne({
          where: { id: leaveTypeId },
        });

        if (!leaveType) {
          throw new Error(`Leave type ${leaveTypeId} not found`);
        }

        const days = this.calculateBusinessDays(startDate, endDate);

        const currentYear = new Date().getFullYear();
        let balance = await leaveBalanceRepository.findOne({
          where: { employeeId, leaveTypeId, year: currentYear },
        });

        if (!balance) {
          balance = (await leaveBalanceRepository.save({
            employeeId,
            leaveTypeId,
            year: currentYear,
            entitled: leaveType.annualQuota || 0,
            used: 0,
            pending: 0,
          } as Partial<LeaveBalanceWorkspaceEntity>)) as unknown as LeaveBalanceWorkspaceEntity;
        }

        const available =
          (balance.entitled || 0) -
          (balance.used || 0) -
          (balance.pending || 0);

        if (days > available) {
          throw new Error(
            `Insufficient leave balance. Available: ${available} days, Requested: ${days} days`,
          );
        }

        await leaveBalanceRepository.save({
          ...balance,
          pending: (balance.pending || 0) + days,
        } as Partial<LeaveBalanceWorkspaceEntity>);

        return (await leaveRequestRepository.save({
          employeeId,
          leaveTypeId,
          startDate,
          endDate,
          days,
          reason,
          status: LeaveRequestStatus.PENDING,
        } as Partial<LeaveRequestWorkspaceEntity>)) as unknown as LeaveRequestWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async approveLeave(
    leaveRequestId: string,
    reviewerId: string,
    reviewNotes: string,
    workspaceId: string,
  ): Promise<LeaveRequestWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const leaveRequestRepository =
          this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>(
            'leaveRequest',
            { shouldBypassPermissionChecks: true },
          );

        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
            { shouldBypassPermissionChecks: true },
          );

        const attendanceDayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
            { shouldBypassPermissionChecks: true },
          );

        const request = await leaveRequestRepository.findOne({
          where: { id: leaveRequestId },
        });

        if (!request) {
          throw new Error(`Leave request ${leaveRequestId} not found`);
        }

        if (request.status !== LeaveRequestStatus.PENDING) {
          throw new Error(`Leave request already ${request.status}`);
        }

        const updated = (await leaveRequestRepository.save({
          ...request,
          status: LeaveRequestStatus.APPROVED,
          reviewedAt: new Date(),
          reviewedById: reviewerId,
          reviewNotes,
        } as Partial<LeaveRequestWorkspaceEntity>)) as unknown as LeaveRequestWorkspaceEntity;

        const currentYear = new Date().getFullYear();
        const balance = await leaveBalanceRepository.findOne({
          where: {
            employeeId: request.employeeId,
            leaveTypeId: request.leaveTypeId,
            year: currentYear,
          },
        });

        if (balance) {
          await leaveBalanceRepository.save({
            ...balance,
            pending: Math.max(0, (balance.pending || 0) - (request.days || 0)),
            used: (balance.used || 0) + (request.days || 0),
          } as Partial<LeaveBalanceWorkspaceEntity>);
        }

        if (request.startDate && request.endDate) {
          const dates = this.getDateRange(
            new Date(request.startDate),
            new Date(request.endDate),
          );

          for (const date of dates) {
            const dayStart = this.getStartOfDay(date);
            let attendanceDay = await attendanceDayRepository.findOne({
              where: { employeeId: request.employeeId, workDate: dayStart },
            });

            if (attendanceDay) {
              await attendanceDayRepository.save({
                ...attendanceDay,
                status: 'LEAVE',
              } as Partial<AttendanceDayWorkspaceEntity>);
            } else {
              await attendanceDayRepository.save({
                employeeId: request.employeeId,
                workDate: dayStart,
                status: 'LEAVE',
              } as Partial<AttendanceDayWorkspaceEntity>);
            }
          }
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'leave_approved',
          [
            {
              leaveRequestId: updated.id,
              employeeId: request.employeeId,
              reviewerId,
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

  async rejectLeave(
    leaveRequestId: string,
    reviewerId: string,
    reviewNotes: string,
    workspaceId: string,
  ): Promise<LeaveRequestWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const leaveRequestRepository =
          this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>(
            'leaveRequest',
            { shouldBypassPermissionChecks: true },
          );

        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
            { shouldBypassPermissionChecks: true },
          );

        const request = await leaveRequestRepository.findOne({
          where: { id: leaveRequestId },
        });

        if (!request) {
          throw new Error(`Leave request ${leaveRequestId} not found`);
        }

        if (request.status !== LeaveRequestStatus.PENDING) {
          throw new Error(`Leave request already ${request.status}`);
        }

        const updated = (await leaveRequestRepository.save({
          ...request,
          status: LeaveRequestStatus.REJECTED,
          reviewedAt: new Date(),
          reviewedById: reviewerId,
          reviewNotes,
        } as Partial<LeaveRequestWorkspaceEntity>)) as unknown as LeaveRequestWorkspaceEntity;

        const currentYear = new Date().getFullYear();
        const balance = await leaveBalanceRepository.findOne({
          where: {
            employeeId: request.employeeId,
            leaveTypeId: request.leaveTypeId,
            year: currentYear,
          },
        });

        if (balance) {
          await leaveBalanceRepository.save({
            ...balance,
            pending: Math.max(0, (balance.pending || 0) - (request.days || 0)),
          } as Partial<LeaveBalanceWorkspaceEntity>);
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'leave_rejected',
          [
            {
              leaveRequestId: updated.id,
              employeeId: request.employeeId,
              reviewerId,
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

  async cancelLeave(
    leaveRequestId: string,
    employeeId: string,
    workspaceId: string,
  ): Promise<LeaveRequestWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const leaveRequestRepository =
          this.workspaceOrmManager.getRepository<LeaveRequestWorkspaceEntity>(
            'leaveRequest',
            { shouldBypassPermissionChecks: true },
          );

        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
            { shouldBypassPermissionChecks: true },
          );

        const request = await leaveRequestRepository.findOne({
          where: { id: leaveRequestId, employeeId },
        });

        if (!request) {
          throw new Error(`Leave request ${leaveRequestId} not found`);
        }

        if (request.status !== LeaveRequestStatus.PENDING) {
          throw new Error('Only pending leave requests can be cancelled');
        }

        const updated = (await leaveRequestRepository.save({
          ...request,
          status: LeaveRequestStatus.CANCELLED,
        } as Partial<LeaveRequestWorkspaceEntity>)) as unknown as LeaveRequestWorkspaceEntity;

        const currentYear = new Date().getFullYear();
        const balance = await leaveBalanceRepository.findOne({
          where: {
            employeeId: request.employeeId,
            leaveTypeId: request.leaveTypeId,
            year: currentYear,
          },
        });

        if (balance) {
          await leaveBalanceRepository.save({
            ...balance,
            pending: Math.max(0, (balance.pending || 0) - (request.days || 0)),
          } as Partial<LeaveBalanceWorkspaceEntity>);
        }

        return updated;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getLeaveBalance(
    employeeId: string,
    year: number,
    workspaceId: string,
  ): Promise<LeaveBalanceWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
          );

        return leaveBalanceRepository.find({
          where: { employeeId, year },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getAvailableLeaveDays(
    employeeId: string,
    leaveTypeId: string,
    workspaceId: string,
  ): Promise<number> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const leaveBalanceRepository =
          this.workspaceOrmManager.getRepository<LeaveBalanceWorkspaceEntity>(
            'leaveBalance',
          );

        const currentYear = new Date().getFullYear();
        const balance = await leaveBalanceRepository.findOne({
          where: { employeeId, leaveTypeId, year: currentYear },
        });

        if (!balance) {
          return 0;
        }

        return (
          (balance.entitled || 0) -
          (balance.used || 0) -
          (balance.pending || 0)
        );
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private calculateBusinessDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  private getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
