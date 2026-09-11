import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type LeaveTypeWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveType.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class LeaveRequestWorkspaceEntity extends BaseWorkspaceEntity {
  startDate: Date | null;
  endDate: Date | null;
  days: number | null;
  reason: string | null;
  status: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  leaveType: EntityRelation<LeaveTypeWorkspaceEntity>;
  leaveTypeId: string | null;
  reviewedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  reviewedById: string | null;
}
