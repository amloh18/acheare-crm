import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { type AttendanceEventWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceEvent.workspace-entity';

export class AttendanceCorrectionWorkspaceEntity extends BaseWorkspaceEntity {
  workDate: Date | null;
  requestedCheckIn: Date | null;
  requestedCheckOut: Date | null;
  reason: string | null;
  status: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  reviewedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  reviewedById: string | null;
  correctedEvents: EntityRelation<AttendanceEventWorkspaceEntity[]> | null;
}
