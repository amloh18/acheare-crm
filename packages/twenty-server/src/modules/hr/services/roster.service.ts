import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { RosterAssignmentWorkspaceEntity } from 'src/modules/hr/standard-objects/rosterAssignment.workspace-entity';
import { ShiftWorkspaceEntity } from 'src/modules/hr/standard-objects/shift.workspace-entity';

@Injectable()
export class RosterService {
  private readonly logger = new Logger(RosterService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  async assignShift(
    employeeId: string,
    shiftId: string,
    effectiveFrom: Date,
    effectiveTo: Date | null,
    workspaceId: string,
  ): Promise<RosterAssignmentWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const rosterRepository =
          this.workspaceOrmManager.getRepository<RosterAssignmentWorkspaceEntity>(
            'rosterAssignment',
            { shouldBypassPermissionChecks: true },
          );

        const existingAssignments = await rosterRepository.find({
          where: { employeeId, isActive: true },
        });

        for (const existing of existingAssignments) {
          if (
            existing.effectiveFrom &&
            existing.effectiveTo &&
            new Date(existing.effectiveFrom as unknown as string) <= effectiveFrom &&
            new Date(existing.effectiveTo as unknown as string) >= effectiveFrom
          ) {
            await rosterRepository.save({
              ...existing,
              isActive: false,
              effectiveTo: new Date(
                effectiveFrom.getTime() - 86400000,
              ),
            } as Partial<RosterAssignmentWorkspaceEntity>);
          }
        }

        return (await rosterRepository.save({
          employeeId,
          shiftId,
          effectiveFrom,
          effectiveTo: effectiveTo || null,
          isActive: true,
        } as Partial<RosterAssignmentWorkspaceEntity>)) as unknown as RosterAssignmentWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getActiveShift(
    employeeId: string,
    workspaceId: string,
  ): Promise<ShiftWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const rosterRepository =
          this.workspaceOrmManager.getRepository<RosterAssignmentWorkspaceEntity>(
            'rosterAssignment',
          );

        const shiftRepository =
          this.workspaceOrmManager.getRepository<ShiftWorkspaceEntity>(
            'shift',
          );

        const assignment = await rosterRepository.findOne({
          where: { employeeId, isActive: true },
        });

        if (!assignment) {
          return null;
        }

        return shiftRepository.findOne({
          where: { id: assignment.shiftId },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getShiftForDate(
    employeeId: string,
    date: Date,
    workspaceId: string,
  ): Promise<ShiftWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const rosterRepository =
          this.workspaceOrmManager.getRepository<RosterAssignmentWorkspaceEntity>(
            'rosterAssignment',
          );

        const shiftRepository =
          this.workspaceOrmManager.getRepository<ShiftWorkspaceEntity>(
            'shift',
          );

        const assignments = await rosterRepository.find({
          where: { employeeId },
        });

        for (const assignment of assignments) {
          const from = new Date(assignment.effectiveFrom as unknown as string);
          const to = assignment.effectiveTo
            ? new Date(assignment.effectiveTo as unknown as string)
            : new Date('2099-12-31');

          if (date >= from && date <= to) {
            return shiftRepository.findOne({
              where: { id: assignment.shiftId },
            });
          }
        }

        return null;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async createShift(
    name: string,
    startTime: string,
    endTime: string,
    breakMinutes: number,
    graceMinutes: number,
    workingDays: string[],
    workspaceId: string,
  ): Promise<ShiftWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const shiftRepository =
          this.workspaceOrmManager.getRepository<ShiftWorkspaceEntity>(
            'shift',
            { shouldBypassPermissionChecks: true },
          );

        return (await shiftRepository.save({
          name,
          startTime,
          endTime,
          breakMinutes,
          graceMinutes,
          workingDays,
          isActive: true,
        } as Partial<ShiftWorkspaceEntity>)) as unknown as ShiftWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getWorkingDaysForShift(
    shiftId: string,
    workspaceId: string,
  ): Promise<string[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const shiftRepository =
          this.workspaceOrmManager.getRepository<ShiftWorkspaceEntity>(
            'shift',
          );

        const shift = await shiftRepository.findOne({
          where: { id: shiftId },
        });

        return shift?.workingDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'];
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async isWorkingDay(
    employeeId: string,
    date: Date,
    workspaceId: string,
  ): Promise<boolean> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const shift = await this.getShiftForDate(employeeId, date, workspaceId);

        if (!shift) {
          const day = date.getDay();
          return day >= 1 && day <= 5;
        }

        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayName = dayNames[date.getDay()];

        return shift.workingDays?.includes(dayName) ?? true;
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
