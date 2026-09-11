import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { AttendanceEventWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceEvent.workspace-entity';
import { AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';
import { AttendanceCorrectionWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceCorrection.workspace-entity';
import { RosterAssignmentWorkspaceEntity } from 'src/modules/hr/standard-objects/rosterAssignment.workspace-entity';
import { ShiftWorkspaceEntity } from 'src/modules/hr/standard-objects/shift.workspace-entity';

export enum AttendanceEventType {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  BREAK_START = 'BREAK_START',
  BREAK_END = 'BREAK_END',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
  HOLIDAY = 'HOLIDAY',
  WEEKLY_OFF = 'WEEKLY_OFF',
  WORK_FROM_HOME = 'WORK_FROM_HOME',
}

export enum AttendanceCorrectionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async checkIn(
    employeeId: string,
    workspaceId: string,
    timestamp?: Date,
  ): Promise<AttendanceEventWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const eventRepository =
          this.workspaceOrmManager.getRepository<AttendanceEventWorkspaceEntity>(
            'attendanceEvent',
            { shouldBypassPermissionChecks: true },
          );

        const dayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
            { shouldBypassPermissionChecks: true },
          );

        const checkInTime = timestamp || new Date();
        const workDate = this.getStartOfDay(checkInTime);

        const existingEvent = await eventRepository.findOne({
          where: {
            employeeId,
            eventType: AttendanceEventType.CHECK_IN,
          },
          order: { createdAt: 'DESC' },
        });

        if (existingEvent) {
          const eventDate = this.getStartOfDay(
            new Date(existingEvent.timestamp || existingEvent.createdAt),
          );
          if (eventDate.getTime() === workDate.getTime()) {
            throw new Error('Already checked in today');
          }
        }

        const event = (await eventRepository.save({
          employeeId,
          eventType: AttendanceEventType.CHECK_IN,
          timestamp: checkInTime,
          source: 'MANUAL',
        } as Partial<AttendanceEventWorkspaceEntity>)) as unknown as AttendanceEventWorkspaceEntity;

        let attendanceDay = await dayRepository.findOne({
          where: { employeeId, workDate },
        });

        if (!attendanceDay) {
          attendanceDay = (await dayRepository.save({
            employeeId,
            workDate,
            firstCheckIn: checkInTime,
            status: AttendanceStatus.PRESENT,
          } as Partial<AttendanceDayWorkspaceEntity>)) as unknown as AttendanceDayWorkspaceEntity;
        } else {
          await dayRepository.save({
            ...attendanceDay,
            firstCheckIn: attendanceDay.firstCheckIn || checkInTime,
          } as Partial<AttendanceDayWorkspaceEntity>);
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'attendance_checkedIn',
          [{ employeeId, timestamp: checkInTime, workspaceId }],
          workspaceId,
        );

        return event;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async checkOut(
    employeeId: string,
    workspaceId: string,
    timestamp?: Date,
  ): Promise<AttendanceEventWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const eventRepository =
          this.workspaceOrmManager.getRepository<AttendanceEventWorkspaceEntity>(
            'attendanceEvent',
            { shouldBypassPermissionChecks: true },
          );

        const dayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
            { shouldBypassPermissionChecks: true },
          );

        const checkOutTime = timestamp || new Date();
        const workDate = this.getStartOfDay(checkOutTime);

        const event = (await eventRepository.save({
          employeeId,
          eventType: AttendanceEventType.CHECK_OUT,
          timestamp: checkOutTime,
          source: 'MANUAL',
        } as Partial<AttendanceEventWorkspaceEntity>)) as unknown as AttendanceEventWorkspaceEntity;

        const attendanceDay = await dayRepository.findOne({
          where: { employeeId, workDate },
        });

        if (attendanceDay) {
          const workedMinutes = attendanceDay.firstCheckIn
            ? Math.round(
                (checkOutTime.getTime() -
                  new Date(attendanceDay.firstCheckIn).getTime()) /
                  60000,
              )
            : 0;

          await dayRepository.save({
            ...attendanceDay,
            lastCheckOut: checkOutTime,
            workedMinutes,
          } as Partial<AttendanceDayWorkspaceEntity>);
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'attendance_checkedOut',
          [{ employeeId, timestamp: checkOutTime, workspaceId }],
          workspaceId,
        );

        return event;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async aggregateDailyAttendance(
    employeeId: string,
    workDate: Date,
    workspaceId: string,
  ): Promise<AttendanceDayWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const eventRepository =
          this.workspaceOrmManager.getRepository<AttendanceEventWorkspaceEntity>(
            'attendanceEvent',
            { shouldBypassPermissionChecks: true },
          );

        const dayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
            { shouldBypassPermissionChecks: true },
          );

        const shiftRepository =
          this.workspaceOrmManager.getRepository<ShiftWorkspaceEntity>(
            'shift',
            { shouldBypassPermissionChecks: true },
          );

        const rosterRepository =
          this.workspaceOrmManager.getRepository<RosterAssignmentWorkspaceEntity>(
            'rosterAssignment',
            { shouldBypassPermissionChecks: true },
          );

        const dayStart = this.getStartOfDay(workDate);
        const dayEnd = this.getEndOfDay(workDate);

        const events = await eventRepository.find({
          where: { employeeId },
          order: { timestamp: 'ASC' },
        });

        const dayEvents = events.filter((e) => {
          const ts = new Date(e.timestamp || e.createdAt);
          return ts >= dayStart && ts <= dayEnd;
        });

        const checkIns = dayEvents.filter(
          (e) => e.eventType === AttendanceEventType.CHECK_IN,
        );
        const checkOuts = dayEvents.filter(
          (e) => e.eventType === AttendanceEventType.CHECK_OUT,
        );

        const firstCheckIn =
          checkIns.length > 0
            ? new Date(checkIns[0].timestamp || checkIns[0].createdAt)
            : null;
        const lastCheckOut =
          checkOuts.length > 0
            ? new Date(checkOuts[checkOuts.length - 1].timestamp || checkOuts[checkOuts.length - 1].createdAt)
            : null;

        let workedMinutes = 0;
        if (firstCheckIn && lastCheckOut) {
          workedMinutes = Math.round(
            (lastCheckOut.getTime() - firstCheckIn.getTime()) / 60000,
          );
        }

        let shift: ShiftWorkspaceEntity | null = null;
        const roster = await rosterRepository.findOne({
          where: {
            employeeId,
            isActive: true,
          },
        });

        if (roster) {
          shift = await shiftRepository.findOne({
            where: { id: roster.shiftId },
          });
        }

        let status = AttendanceStatus.ABSENT;
        if (firstCheckIn) {
          status = AttendanceStatus.PRESENT;
        }

        let lateMinutes = 0;
        if (firstCheckIn && shift?.startTime) {
          const [hours, minutes] = shift.startTime.split(':').map(Number);
          const shiftStart = new Date(workDate);
          shiftStart.setHours(hours, minutes, 0, 0);

          if (firstCheckIn > shiftStart) {
            lateMinutes = Math.round(
              (firstCheckIn.getTime() - shiftStart.getTime()) / 60000,
            );
            if (lateMinutes > 60) {
              status = AttendanceStatus.LATE;
            }
          }
        }

        let attendanceDay = await dayRepository.findOne({
          where: { employeeId, workDate: dayStart },
        });

        if (attendanceDay) {
          attendanceDay = (await dayRepository.save({
            ...attendanceDay,
            status,
            firstCheckIn,
            lastCheckOut,
            workedMinutes,
            lateMinutes,
            shiftId: roster?.shiftId || null,
          } as Partial<AttendanceDayWorkspaceEntity>)) as unknown as AttendanceDayWorkspaceEntity;
        } else {
          attendanceDay = (await dayRepository.save({
            employeeId,
            workDate: dayStart,
            status,
            firstCheckIn,
            lastCheckOut,
            workedMinutes,
            lateMinutes,
            shiftId: roster?.shiftId || null,
          } as Partial<AttendanceDayWorkspaceEntity>)) as unknown as AttendanceDayWorkspaceEntity;
        }

        return attendanceDay;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async requestCorrection(
    employeeId: string,
    workDate: Date,
    requestedCheckIn: Date,
    requestedCheckOut: Date,
    reason: string,
    workspaceId: string,
  ): Promise<AttendanceCorrectionWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const correctionRepository =
          this.workspaceOrmManager.getRepository<AttendanceCorrectionWorkspaceEntity>(
            'attendanceCorrection',
            { shouldBypassPermissionChecks: true },
          );

        return (await correctionRepository.save({
          employeeId,
          workDate,
          requestedCheckIn,
          requestedCheckOut,
          reason,
          status: AttendanceCorrectionStatus.PENDING,
        } as Partial<AttendanceCorrectionWorkspaceEntity>)) as unknown as AttendanceCorrectionWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async reviewCorrection(
    correctionId: string,
    approved: boolean,
    reviewerId: string,
    reviewNotes: string,
    workspaceId: string,
  ): Promise<AttendanceCorrectionWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const correctionRepository =
          this.workspaceOrmManager.getRepository<AttendanceCorrectionWorkspaceEntity>(
            'attendanceCorrection',
            { shouldBypassPermissionChecks: true },
          );

        const dayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
            { shouldBypassPermissionChecks: true },
          );

        const correction = await correctionRepository.findOne({
          where: { id: correctionId },
        });

        if (!correction) {
          throw new Error(`Correction ${correctionId} not found`);
        }

        if (correction.status !== AttendanceCorrectionStatus.PENDING) {
          throw new Error(`Correction already ${correction.status}`);
        }

        const status = approved
          ? AttendanceCorrectionStatus.APPROVED
          : AttendanceCorrectionStatus.REJECTED;

        const updated = (await correctionRepository.save({
          ...correction,
          status,
          reviewedAt: new Date(),
          reviewedById: reviewerId,
          reviewNotes,
        } as Partial<AttendanceCorrectionWorkspaceEntity>)) as unknown as AttendanceCorrectionWorkspaceEntity;

        if (approved && correction.workDate) {
          const workDate = this.getStartOfDay(new Date(correction.workDate));

          await dayRepository.save({
            employeeId: correction.employeeId,
            workDate,
            firstCheckIn: correction.requestedCheckIn,
            lastCheckOut: correction.requestedCheckOut,
            status: AttendanceStatus.PRESENT,
          } as Partial<AttendanceDayWorkspaceEntity>);
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'attendance_correctionReviewed',
          [
            {
              correctionId: updated.id,
              approved,
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

  async getAttendanceSummary(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    workspaceId: string,
  ): Promise<{
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    leave: number;
    holidays: number;
    totalWorkedMinutes: number;
    totalOvertimeMinutes: number;
  }> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const dayRepository =
          this.workspaceOrmManager.getRepository<AttendanceDayWorkspaceEntity>(
            'attendanceDay',
          );

        const days = await dayRepository.find({
          where: { employeeId },
        });

        const filteredDays = days.filter((d) => {
          const workDate = new Date(d.workDate as unknown as string);
          return workDate >= startDate && workDate <= endDate;
        });

        return {
          present: filteredDays.filter(
            (d) => d.status === AttendanceStatus.PRESENT,
          ).length,
          absent: filteredDays.filter(
            (d) => d.status === AttendanceStatus.ABSENT,
          ).length,
          late: filteredDays.filter(
            (d) => d.status === AttendanceStatus.LATE,
          ).length,
          halfDay: filteredDays.filter(
            (d) => d.status === AttendanceStatus.HALF_DAY,
          ).length,
          leave: filteredDays.filter(
            (d) => d.status === AttendanceStatus.LEAVE,
          ).length,
          holidays: filteredDays.filter(
            (d) => d.status === AttendanceStatus.HOLIDAY,
          ).length,
          totalWorkedMinutes: filteredDays.reduce(
            (sum, d) => sum + (d.workedMinutes || 0),
            0,
          ),
          totalOvertimeMinutes: filteredDays.reduce(
            (sum, d) => sum + (d.overtimeMinutes || 0),
            0,
          ),
        };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getEndOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
