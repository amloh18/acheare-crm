import { type CurrencyMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type InterviewWorkspaceEntity } from 'src/modules/recruitment/standard-objects/interview.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class RequirementWorkspaceEntity extends BaseWorkspaceEntity {
  title: string;
  position: string | null;
  numberOfOpenings: number | null;
  filledCount: number | null;
  location: string | null;
  workMode: string | null;
  employmentType: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: CurrencyMetadata | null;
  salaryMax: CurrencyMetadata | null;
  skills: string[] | null;
  education: string | null;
  description: string | null;
  responsibilities: string | null;
  requirementsText: string | null;
  priority: string | null;
  status: string;
  receivedAt: Date | null;
  targetDate: Date | null;
  closedAt: Date | null;

  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  pointOfContact: EntityRelation<PersonWorkspaceEntity> | null;
  pointOfContactId: string | null;
  deal: EntityRelation<OpportunityWorkspaceEntity> | null;
  dealId: string | null;
  bdeOwner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  bdeOwnerId: string | null;
  hrOwner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  hrOwnerId: string | null;
  recruiterOwner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  recruiterOwnerId: string | null;

  candidateSubmissions: EntityRelation<CandidateSubmissionWorkspaceEntity[]>;
  interviews: EntityRelation<InterviewWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
}
