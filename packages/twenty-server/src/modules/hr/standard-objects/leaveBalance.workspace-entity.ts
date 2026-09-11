import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type LeaveTypeWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveType.workspace-entity';

export class LeaveBalanceWorkspaceEntity extends BaseWorkspaceEntity {
  year: number | null;
  entitled: number | null;
  used: number | null;
  pending: number | null;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  leaveType: EntityRelation<LeaveTypeWorkspaceEntity>;
  leaveTypeId: string | null;
}
