import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class OnboardingItemWorkspaceEntity extends BaseWorkspaceEntity {
  title: string | null;
  category: string | null;
  isRequired: boolean;
  dueDate: Date | null;
  status: string | null;
  completedAt: Date | null;
  notes: string | null;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  assignedTo: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  assignedToId: string | null;
}
