import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';

export class LocationWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  timezone: string | null;
  status: string | null;
  latitude: number | null;
  longitude: number | null;
  geofenceRadiusMeters: number | null;
  isActive: boolean;

  employees: EntityRelation<EmployeeWorkspaceEntity[]> | null;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]> | null;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]> | null;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]> | null;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]> | null;
}
