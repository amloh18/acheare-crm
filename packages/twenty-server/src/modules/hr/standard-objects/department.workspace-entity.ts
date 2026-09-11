import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';

export class DepartmentWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  description: string | null;
  status: string | null;

  departmentHead: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  departmentHeadId: string | null;
  employees: EntityRelation<EmployeeWorkspaceEntity[]> | null;
}
