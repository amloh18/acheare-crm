import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PayslipWorkspaceEntity } from 'src/modules/hr/standard-objects/payslip.workspace-entity';

export class PayslipLineWorkspaceEntity extends BaseWorkspaceEntity {
  label: string | null;
  lineType: string | null;
  amount: CurrencyMetadata | null;
  notes: string | null;
  position: number;

  payslip: EntityRelation<PayslipWorkspaceEntity>;
  payslipId: string | null;
}
