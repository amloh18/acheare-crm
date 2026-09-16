import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type ShiftWorkspaceEntity } from 'src/modules/hr/standard-objects/shift.workspace-entity';

export class AttendanceDayWorkspaceEntity extends BaseWorkspaceEntity {
  workDate: Date | null;
  status: string | null;
  firstCheckIn: Date | null;
  lastCheckOut: Date | null;
  workedMinutes: number | null;
  breakMinutes: number | null;
  lateMinutes: number | null;
  earlyDepartureMinutes: number | null;
  overtimeMinutes: number | null;
  hasRemoteCheckIn: boolean;

  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  shift: EntityRelation<ShiftWorkspaceEntity> | null;
  shiftId: string | null;
}
