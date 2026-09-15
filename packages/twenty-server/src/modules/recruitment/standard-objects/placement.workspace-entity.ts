import { type CurrencyMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CandidateWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate.workspace-entity';
import { type CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';

export class PlacementWorkspaceEntity extends BaseWorkspaceEntity {
  placementDate: Date | null;
  joiningDate: Date | null;
  replacementDueDate: Date | null;
  placementFee: CurrencyMetadata | null;
  salary: CurrencyMetadata | null;
  feeStatus: string | null;
  status: string | null;
  notes: string | null;

  submission: EntityRelation<CandidateSubmissionWorkspaceEntity> | null;
  submissionId: string | null;
  candidate: EntityRelation<CandidateWorkspaceEntity> | null;
  candidateId: string | null;
}
