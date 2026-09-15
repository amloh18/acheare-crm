import { type ActorMetadata, type LinksMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export class PersonExternalIdWorkspaceEntity extends BaseWorkspaceEntity {
  source: string;
  externalId: string;
  externalUrl: LinksMetadata | null;
  syncedAt: Date | null;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;

  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
}
