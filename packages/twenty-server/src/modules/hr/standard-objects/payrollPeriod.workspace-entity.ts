import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PayrollAdjustmentWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollAdjustment.workspace-entity';
import { type PayslipWorkspaceEntity } from 'src/modules/hr/standard-objects/payslip.workspace-entity';

export class PayrollPeriodWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  startDate: Date | null;
  endDate: Date | null;
  payDate: Date | null;
  status: string | null;
  employeeCount: number | null;
  totalGross: CurrencyMetadata | null;
  totalDeductions: CurrencyMetadata | null;
  totalAdjustments: CurrencyMetadata | null;
  totalNet: CurrencyMetadata | null;

  payslips: EntityRelation<PayslipWorkspaceEntity[]> | null;
  payrollAdjustments: EntityRelation<PayrollAdjustmentWorkspaceEntity[]> | null;
}
