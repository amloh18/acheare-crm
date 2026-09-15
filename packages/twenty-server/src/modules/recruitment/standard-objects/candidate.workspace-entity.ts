import { type CurrencyMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';
import { type InterviewWorkspaceEntity } from 'src/modules/recruitment/standard-objects/interview.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type PlacementWorkspaceEntity } from 'src/modules/recruitment/standard-objects/placement.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class CandidateWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  source: string | null;
  skills: string[] | null;
  totalExperienceYears: number | null;
  currentCompany: string | null;
  currentDesignation: string | null;
  currentSalary: CurrencyMetadata | null;
  expectedSalary: CurrencyMetadata | null;
  noticePeriod: string | null;
  preferredLocation: string | null;
  status: string | null;

  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  recruiterOwner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  recruiterOwnerId: string | null;

  candidateSubmissions: EntityRelation<CandidateSubmissionWorkspaceEntity[]>;
  interviews: EntityRelation<InterviewWorkspaceEntity[]>;
  placements: EntityRelation<PlacementWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
}
