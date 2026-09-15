import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type InterviewWorkspaceEntity } from 'src/modules/recruitment/standard-objects/interview.workspace-entity';

export class InterviewParticipantWorkspaceEntity extends BaseWorkspaceEntity {
  role: string | null;
  response: string | null;
  feedback: string | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  interview: EntityRelation<InterviewWorkspaceEntity> | null;
  interviewId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
}
