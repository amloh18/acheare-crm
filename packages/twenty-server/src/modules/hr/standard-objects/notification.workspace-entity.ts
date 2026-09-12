import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

export class NotificationWorkspaceEntity extends BaseWorkspaceEntity {
  type: string;
  title: string;
  body: string | null;
  recipientId: string;
  senderId: string | null;
  recordId: string | null;
  objectName: string | null;
  isRead: boolean;
  readAt: Date | null;

  recipient: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  sender: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
}
