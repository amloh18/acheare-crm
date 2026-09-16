import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class CompanySettingsWorkspaceEntity extends BaseWorkspaceEntity {
  companyName: string | null;
  workStartTime: string | null;
  workEndTime: string | null;
  breakMinutes: number | null;
  graceMinutes: number | null;
  workingDays: string[] | null;
  lateThresholdMinutes: number | null;
  halfDayThresholdMinutes: number | null;
  absentThresholdMinutes: number | null;
  timingMode: string | null;
  flexibleHoursRequired: number | null;
  requireGeolocationForCheckIn: boolean;
  allowRemoteCheckIn: boolean;
  isActive: boolean;
}
