import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';

export class DesignationWorkspaceEntity extends BaseWorkspaceEntity {
  title: string;
  description: string | null;
  level: string | null;
  status: string | null;

  employees: EntityRelation<EmployeeWorkspaceEntity[]> | null;
}
