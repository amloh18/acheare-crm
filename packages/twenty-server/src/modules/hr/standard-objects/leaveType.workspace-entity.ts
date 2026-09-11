import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type LeaveRequestWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveRequest.workspace-entity';
import { type LeaveBalanceWorkspaceEntity } from 'src/modules/hr/standard-objects/leaveBalance.workspace-entity';

export class LeaveTypeWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  isPaid: boolean;
  annualQuota: number | null;
  isActive: boolean;

  leaveRequests: EntityRelation<LeaveRequestWorkspaceEntity[]> | null;
  leaveBalances: EntityRelation<LeaveBalanceWorkspaceEntity[]> | null;
}
