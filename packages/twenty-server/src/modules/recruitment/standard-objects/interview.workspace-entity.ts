import { type LinksMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';
import { type CandidateWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type RequirementWorkspaceEntity } from 'src/modules/recruitment/standard-objects/requirement.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class InterviewWorkspaceEntity extends BaseWorkspaceEntity {
  title: string;
  round: string | null;
  interviewer: string | null;
  scheduledAt: Date | null;
  mode: string | null;
  meetingLink: LinksMetadata | null;
  status: string | null;
  result: string | null;
  feedback: string | null;

  submission: EntityRelation<CandidateSubmissionWorkspaceEntity> | null;
  submissionId: string | null;
  requirement: EntityRelation<RequirementWorkspaceEntity> | null;
  requirementId: string | null;
  candidate: EntityRelation<CandidateWorkspaceEntity> | null;
  candidateId: string | null;
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;

  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
}
