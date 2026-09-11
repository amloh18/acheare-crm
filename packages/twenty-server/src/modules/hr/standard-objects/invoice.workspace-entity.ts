import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type RequirementWorkspaceEntity } from 'src/modules/recruitment/standard-objects/requirement.workspace-entity';
import { type PaymentWorkspaceEntity } from 'src/modules/hr/standard-objects/payment.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

export class InvoiceWorkspaceEntity extends BaseWorkspaceEntity {
  invoiceNumber: string | null;
  amount: CurrencyMetadata | null;
  invoiceDate: Date | null;
  dueDate: Date | null;
  status: string | null;
  amountPaid: CurrencyMetadata | null;
  outstanding: CurrencyMetadata | null;
  notes: string | null;

  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  deal: EntityRelation<OpportunityWorkspaceEntity> | null;
  dealId: string | null;
  requirement: EntityRelation<RequirementWorkspaceEntity> | null;
  requirementId: string | null;
  payments: EntityRelation<PaymentWorkspaceEntity[]> | null;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]> | null;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]> | null;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]> | null;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]> | null;
}
