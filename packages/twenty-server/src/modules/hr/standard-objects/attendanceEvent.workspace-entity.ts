import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type AttendanceCorrectionWorkspaceEntity } from 'src/modules/hr/standard-objects/attendanceCorrection.workspace-entity';

export class AttendanceEventWorkspaceEntity extends BaseWorkspaceEntity {
  timestamp: Date | null;
  eventType: string | null;
  source: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  isRemote: boolean;
  approvalStatus: string | null;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  correction: EntityRelation<AttendanceCorrectionWorkspaceEntity> | null;
  correctionId: string | null;
}
