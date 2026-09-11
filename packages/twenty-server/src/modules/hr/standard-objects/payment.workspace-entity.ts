import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type InvoiceWorkspaceEntity } from 'src/modules/hr/standard-objects/invoice.workspace-entity';

export class PaymentWorkspaceEntity extends BaseWorkspaceEntity {
  amount: CurrencyMetadata | null;
  paidDate: Date | null;
  method: string | null;
  reference: string | null;
  notes: string | null;

  invoice: EntityRelation<InvoiceWorkspaceEntity>;
  invoiceId: string | null;
}
