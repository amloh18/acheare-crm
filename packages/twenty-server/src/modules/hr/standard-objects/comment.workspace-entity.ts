import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class CommentWorkspaceEntity extends BaseWorkspaceEntity {
  body: string;
  recordId: string;
  objectName: string;
  authorId: string;
  parentId: string | null;

  author: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
}
