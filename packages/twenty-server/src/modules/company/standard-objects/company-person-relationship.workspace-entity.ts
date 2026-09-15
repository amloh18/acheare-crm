import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class CompanyPersonRelationshipWorkspaceEntity extends BaseWorkspaceEntity {
  jobTitle: string | null;
  department: string | null;
  relationshipType: string | null;
  isPrimary: boolean;
  status: string | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  relationshipOwner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  relationshipOwnerId: string | null;
}
