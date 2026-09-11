import { type CurrencyMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CandidateWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate.workspace-entity';
import { type InterviewWorkspaceEntity } from 'src/modules/recruitment/standard-objects/interview.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type RequirementWorkspaceEntity } from 'src/modules/recruitment/standard-objects/requirement.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class CandidateSubmissionWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  stage: string;
  resumeSent: boolean | null;
  clientFeedback: string | null;
  expectedSalary: CurrencyMetadata | null;
  offeredSalary: CurrencyMetadata | null;
  joiningDate: Date | null;
  rejectionReason: string | null;
  dropReason: string | null;

  candidate: EntityRelation<CandidateWorkspaceEntity> | null;
  candidateId: string | null;
  requirement: EntityRelation<RequirementWorkspaceEntity> | null;
  requirementId: string | null;
  recruiter: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  recruiterId: string | null;
  hrOwner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  hrOwnerId: string | null;

  interviews: EntityRelation<InterviewWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
}
