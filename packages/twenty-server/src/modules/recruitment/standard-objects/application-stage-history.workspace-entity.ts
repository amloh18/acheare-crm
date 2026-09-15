import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class ApplicationStageHistoryWorkspaceEntity extends BaseWorkspaceEntity {
  fromStage: string | null;
  toStage: string;
  changedAt: Date;
  reason: string | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  submission: EntityRelation<CandidateSubmissionWorkspaceEntity> | null;
  submissionId: string | null;
  changedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  changedById: string | null;
}
