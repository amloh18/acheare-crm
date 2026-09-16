import { Injectable } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { CompanySettingsWorkspaceEntity } from 'src/modules/hr/standard-objects/companySettings.workspace-entity';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';

export type CompanySettingsInput = {
  companyName?: string | null;
  workStartTime?: string | null;
  workEndTime?: string | null;
  breakMinutes?: number | null;
  graceMinutes?: number | null;
  workingDays?: string[] | null;
  lateThresholdMinutes?: number | null;
  halfDayThresholdMinutes?: number | null;
  absentThresholdMinutes?: number | null;
  timingMode?: string | null;
  flexibleHoursRequired?: number | null;
  requireGeolocationForCheckIn?: boolean;
  allowRemoteCheckIn?: boolean;
};

@Injectable()
export class CompanySettingsService {
  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  async getCompanySettings(
    workspaceId: string,
  ): Promise<CompanySettingsWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const settingsRepository =
          this.workspaceOrmManager.getRepository<CompanySettingsWorkspaceEntity>(
            'companySettings',
            { shouldBypassPermissionChecks: true },
          );

        const settings = await settingsRepository.find({
          where: { isActive: true },
          take: 1,
        });

        return settings[0] || null;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async upsertCompanySettings(
    input: CompanySettingsInput,
    workspaceId: string,
  ): Promise<CompanySettingsWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const settingsRepository =
          this.workspaceOrmManager.getRepository<CompanySettingsWorkspaceEntity>(
            'companySettings',
            { shouldBypassPermissionChecks: true },
          );

        const existing = await settingsRepository.find({
          where: { isActive: true },
          take: 1,
        });

        if (existing.length > 0) {
          const updated = await settingsRepository.save({
            ...existing[0],
            ...input,
          });

          return updated as unknown as CompanySettingsWorkspaceEntity;
        }

        const created = await settingsRepository.save({
          companyName: input.companyName || 'My Company',
          workStartTime: input.workStartTime || '09:00',
          workEndTime: input.workEndTime || '18:00',
          breakMinutes: input.breakMinutes || 60,
          graceMinutes: input.graceMinutes || 15,
          workingDays: input.workingDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
          lateThresholdMinutes: input.lateThresholdMinutes || 15,
          halfDayThresholdMinutes: input.halfDayThresholdMinutes || 240,
          absentThresholdMinutes: input.absentThresholdMinutes || 480,
          timingMode: input.timingMode || 'FIXED',
          flexibleHoursRequired: input.flexibleHoursRequired || 8,
          requireGeolocationForCheckIn: input.requireGeolocationForCheckIn ?? true,
          allowRemoteCheckIn: input.allowRemoteCheckIn ?? true,
          isActive: true,
        });

        return created as unknown as CompanySettingsWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getEffectiveTimingMode(
    employeeId: string,
    workspaceId: string,
  ): Promise<{ timingMode: string; flexibleHoursRequired: number }> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const settingsRepository =
          this.workspaceOrmManager.getRepository<CompanySettingsWorkspaceEntity>(
            'companySettings',
            { shouldBypassPermissionChecks: true },
          );

        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const settings = await settingsRepository.find({
          where: { isActive: true },
          take: 1,
        });

        const companySettings = settings[0];
        const timingMode = companySettings?.timingMode || 'FIXED';
        const flexibleHoursRequired = companySettings?.flexibleHoursRequired || 8;

        const employee = await employeeRepository.findOne({
          where: { id: employeeId },
        });

        if (employee?.timingModeOverride) {
          return {
            timingMode: employee.timingModeOverride,
            flexibleHoursRequired: employee.flexibleHoursOverride || flexibleHoursRequired,
          };
        }

        return { timingMode, flexibleHoursRequired };
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
