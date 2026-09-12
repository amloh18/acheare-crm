import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type RosterAssignmentWorkspaceEntity } from 'src/modules/hr/standard-objects/rosterAssignment.workspace-entity';
import { type AttendanceDayWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceDay.workspace-entity';

export class ShiftWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  startTime: string | null;
  endTime: string | null;
  breakMinutes: number | null;
  graceMinutes: number | null;
  workingDays: string[] | null;
  isActive: boolean;

  rosterAssignments: EntityRelation<RosterAssignmentWorkspaceEntity[]> | null;
  attendanceDays: EntityRelation<AttendanceDayWorkspaceEntity[]> | null;
}
