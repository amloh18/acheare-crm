import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type PayrollPeriodWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollPeriod.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class PayrollAdjustmentWorkspaceEntity extends BaseWorkspaceEntity {
  adjustmentType: string | null;
  amount: CurrencyMetadata | null;
  reason: string | null;
  status: string | null;
  approvedAt: Date | null;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  payrollPeriod: EntityRelation<PayrollPeriodWorkspaceEntity>;
  payrollPeriodId: string | null;
  approvedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  approvedById: string | null;
}
