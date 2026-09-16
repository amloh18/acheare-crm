import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { AttendanceEventWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceEvent.workspace-entity';
import { AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';
import { AttendanceCorrectionWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceCorrection.workspace-entity';
import { RosterAssignmentWorkspaceEntity } from 'src/modules/hr/standard-objects/rosterAssignment.workspace-entity';
import { ShiftWorkspaceEntity } from 'src/modules/hr/standard-objects/shift.workspace-entity';
import { CompanySettingsWorkspaceEntity } from 'src/modules/hr/standard-objects/companySettings.workspace-entity';
import { LocationService } from 'src/modules/hr/services/location.service';

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

export enum RemoteCheckInApprovalStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
    private readonly locationService: LocationService,
  ) {}

  private async getCompanySettings(
    workspaceId: string,
  ): Promise<CompanySettingsWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const settingsRepository =
          this.workspaceOrmManager.getRepository<CompanySettingsWorkspaceEntity>(
            'companySettings',
            { shouldBypassPermissionChecks: true },
          );

        const settings = await settingsRepository.find({
          where: { isActive: true },
          take: 1,
        });

        return settings[0] || null;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async checkIn(
    employeeId: string,
    workspaceId: string,
    timestamp?: Date,
    latitude?: number,
    longitude?: number,
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
          const eventTs = new Date(existingEvent.timestamp || existingEvent.createdAt);
          const eventDate = this.getStartOfDay(eventTs);
          if (eventDate.getTime() === workDate.getTime()) {
            throw new Error('Already checked in today');
          }
        }

        const companySettings = await this.getCompanySettings(workspaceId);
        const requireGeolocation = companySettings?.requireGeolocationForCheckIn ?? true;
        const allowRemote = companySettings?.allowRemoteCheckIn ?? true;

        let isRemote = false;
        let approvalStatus: string | null = null;
        let locationName: string | null = null;

        if (requireGeolocation) {
          if (latitude == null || longitude == null) {
            throw new Error('Geolocation is required for clock-in');
          }

          const nearest = await this.locationService.findNearestLocation(
            latitude,
            longitude,
            workspaceId,
          );

          if (nearest) {
            locationName = nearest.location.name;
            isRemote = false;
            approvalStatus = null;
          } else {
            isRemote = true;
            locationName = 'Remote';
            approvalStatus = allowRemote
              ? RemoteCheckInApprovalStatus.PENDING
              : null;

            if (!allowRemote) {
              throw new Error('Remote clock-in is not allowed');
            }
          }
        }

        const event = (await eventRepository.save({
          employeeId,
          eventType: AttendanceEventType.CHECK_IN,
          timestamp: checkInTime,
          source: 'SELF_SERVICE',
          latitude: latitude || null,
          longitude: longitude || null,
          locationName,
          isRemote,
          approvalStatus,
        } as Partial<AttendanceEventWorkspaceEntity>)) as unknown as AttendanceEventWorkspaceEntity;

        let attendanceDay = await dayRepository.findOne({
          where: { employeeId, workDate },
        });

        if (!attendanceDay) {
          attendanceDay = (await dayRepository.save({
            employeeId,
            workDate,
            firstCheckIn: checkInTime,
            status: isRemote && approvalStatus === RemoteCheckInApprovalStatus.PENDING
              ? AttendanceStatus.WORK_FROM_HOME
              : AttendanceStatus.PRESENT,
            hasRemoteCheckIn: isRemote,
          } as Partial<AttendanceDayWorkspaceEntity>)) as unknown as AttendanceDayWorkspaceEntity;
        } else {
          await dayRepository.save({
            ...attendanceDay,
            firstCheckIn: attendanceDay.firstCheckIn || checkInTime,
            hasRemoteCheckIn: attendanceDay.hasRemoteCheckIn || isRemote,
          } as Partial<AttendanceDayWorkspaceEntity>);
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'attendance_checkedIn',
          [{ employeeId, timestamp: checkInTime, workspaceId, isRemote }],
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
    latitude?: number,
    longitude?: number,
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

        let locationName: string | null = null;
        if (latitude != null && longitude != null) {
          const nearest = await this.locationService.findNearestLocation(
            latitude,
            longitude,
            workspaceId,
          );
          locationName = nearest?.location.name || 'Remote';
        }

        const event = (await eventRepository.save({
          employeeId,
          eventType: AttendanceEventType.CHECK_OUT,
          timestamp: checkOutTime,
          source: 'SELF_SERVICE',
          latitude: latitude || null,
          longitude: longitude || null,
          locationName,
          isRemote: false,
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

  async approveRemoteCheckIn(
    eventId: string,
    approved: boolean,
    reviewerId: string,
    workspaceId: string,
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

        const event = await eventRepository.findOne({
          where: { id: eventId },
        });

        if (!event) {
          throw new Error('Attendance event not found');
        }

        if (event.approvalStatus !== RemoteCheckInApprovalStatus.PENDING) {
          throw new Error('This check-in is not pending approval');
        }

        const newStatus = approved
          ? RemoteCheckInApprovalStatus.APPROVED
          : RemoteCheckInApprovalStatus.REJECTED;

        const updated = (await eventRepository.save({
          ...event,
          approvalStatus: newStatus,
        } as Partial<AttendanceEventWorkspaceEntity>)) as unknown as AttendanceEventWorkspaceEntity;

        if (event.timestamp) {
          const workDate = this.getStartOfDay(new Date(event.timestamp));

          if (approved) {
            await dayRepository.save({
              employeeId: event.employeeId,
              workDate,
              status: AttendanceStatus.PRESENT,
            } as Partial<AttendanceDayWorkspaceEntity>);
          } else {
            await dayRepository.save({
              employeeId: event.employeeId,
              workDate,
              status: AttendanceStatus.ABSENT,
            } as Partial<AttendanceDayWorkspaceEntity>);
          }
        }

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'attendance_remoteCheckInReviewed',
          [
            {
              eventId,
              employeeId: event.employeeId,
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

  async getPendingRemoteCheckIns(
    workspaceId: string,
  ): Promise<AttendanceEventWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const eventRepository =
          this.workspaceOrmManager.getRepository<AttendanceEventWorkspaceEntity>(
            'attendanceEvent',
            { shouldBypassPermissionChecks: true },
          );

        return eventRepository.find({
          where: {
            eventType: AttendanceEventType.CHECK_IN,
            isRemote: true,
            approvalStatus: RemoteCheckInApprovalStatus.PENDING,
          },
          order: { createdAt: 'DESC' },
        });
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

        const companySettings = await this.getCompanySettings(workspaceId);
        const graceMinutes = companySettings?.graceMinutes ?? shift?.graceMinutes ?? 15;

        const hasRemoteCheckIn = checkIns.some((e) => e.isRemote);
        const hasPendingRemote = checkIns.some(
          (e) => e.isRemote && e.approvalStatus === RemoteCheckInApprovalStatus.PENDING,
        );

        let status = AttendanceStatus.ABSENT;
        if (firstCheckIn) {
          if (hasPendingRemote) {
            status = AttendanceStatus.WORK_FROM_HOME;
          } else {
            status = AttendanceStatus.PRESENT;
          }
        }

        const timingMode = companySettings?.timingMode || 'FIXED';

        if (timingMode === 'FIXED' && firstCheckIn && shift?.startTime) {
          const [hours, minutes] = shift.startTime.split(':').map(Number);
          const shiftStart = new Date(workDate);
          shiftStart.setHours(hours, minutes, 0, 0);

          if (firstCheckIn > shiftStart) {
            const lateMinutes = Math.round(
              (firstCheckIn.getTime() - shiftStart.getTime()) / 60000,
            );
            if (lateMinutes > graceMinutes && status !== AttendanceStatus.WORK_FROM_HOME) {
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
            shiftId: roster?.shiftId || null,
            hasRemoteCheckIn,
          } as Partial<AttendanceDayWorkspaceEntity>)) as unknown as AttendanceDayWorkspaceEntity;
        } else {
          attendanceDay = (await dayRepository.save({
            employeeId,
            workDate: dayStart,
            status,
            firstCheckIn,
            lastCheckOut,
            workedMinutes,
            shiftId: roster?.shiftId || null,
            hasRemoteCheckIn,
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
