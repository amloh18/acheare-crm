import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

export class AnnouncementWorkspaceEntity extends BaseWorkspaceEntity {
  title: string;
  body: string | null;
  audience: string | null;
  targetDepartmentIds: string[] | null;
  targetTeamIds: string[] | null;
  publishAt: Date | null;
  expiresAt: Date | null;
  isPublished: boolean;

  author: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  authorId: string | null;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]> | null;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]> | null;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]> | null;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]> | null;
}
