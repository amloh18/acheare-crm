import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import {
  AchareSetupStepKeys,
  ACHARE_SETUP_CURRENT_VERSION,
  ACHARE_SETUP_STEPS_ORDER,
  type AchareSetupMode,
  type AchareSetupStep,
  type AchareSetupStatus,
} from 'src/engine/core-modules/onboarding/constants/acheare-setup-step-keys';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import {
  OnboardingException,
  OnboardingExceptionCode,
} from 'src/engine/core-modules/onboarding/onboarding.exception';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export type AchareSetupKeyValueTypeMap = {
  [AchareSetupStepKeys.ACHARE_SETUP_STATUS]: AchareSetupStatus;
  [AchareSetupStepKeys.ACHARE_SETUP_MODE]: AchareSetupMode;
  [AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP]: AchareSetupStep;
  [AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_AGENCY_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_TEAM_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_CRM_IMPORT_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_RECRUITMENT_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_HR_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_HR_SKIPPED]: boolean;
  [AchareSetupStepKeys.ACHARE_PAYROLL_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_PAYROLL_SKIPPED]: boolean;
  [AchareSetupStepKeys.ACHARE_DASHBOARD_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_SETUP_COMPLETED_AT]: string;
  [AchareSetupStepKeys.ACHARE_SETUP_VERSION]: number;
};

export interface AchareSetupProgress {
  status: AchareSetupStatus;
  mode: AchareSetupMode | null;
  currentStep: AchareSetupStep | null;
  completedSteps: AchareSetupStep[];
  completedAt: string | null;
  setupVersion: number | null;
}

export interface AchareSetupStepStatus {
  step: AchareSetupStep;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
}

@Injectable()
export class AchareOnboardingService {
  private readonly logger = new Logger(AchareOnboardingService.name);

  constructor(
    private readonly userVarsService: UserVarsService<AchareSetupKeyValueTypeMap>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  async isAchareOnboardingActive({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<boolean> {
    const status = await this.userVarsService.get({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_STATUS,
    });

    return status === 'IN_PROGRESS';
  }

  async getSetupStatus({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<OnboardingStatus> {
    const currentStep = await this.userVarsService.get({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP,
    });

    if (!isDefined(currentStep)) {
      return OnboardingStatus.ACHARE_WELCOME;
    }

    const stepToStatusMap: Record<AchareSetupStep, OnboardingStatus> = {
      WELCOME: OnboardingStatus.ACHARE_WELCOME,
      BASIC_SETUP: OnboardingStatus.ACHARE_BASIC_SETUP,
      SETUP_CHOICE: OnboardingStatus.ACHARE_SETUP_CHOICE,
      AGENCY: OnboardingStatus.ACHARE_AGENCY,
      TEAM: OnboardingStatus.ACHARE_TEAM,
      CRM_IMPORT: OnboardingStatus.ACHARE_CRM_IMPORT,
      RECRUITMENT: OnboardingStatus.ACHARE_RECRUITMENT,
      HR: OnboardingStatus.ACHARE_HR,
      PAYROLL: OnboardingStatus.ACHARE_PAYROLL,
      DASHBOARD: OnboardingStatus.ACHARE_DASHBOARD,
      REVIEW: OnboardingStatus.ACHARE_REVIEW,
    };

    return stepToStatusMap[currentStep] ?? OnboardingStatus.ACHARE_WELCOME;
  }

  async getSetupProgress({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<AchareSetupProgress> {
    const userVars = await this.userVarsService.getAll({
      userId,
      workspaceId,
    });

    const status =
      (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_STATUS) as AchareSetupStatus) ?? 'NOT_STARTED';
    const mode = (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_MODE) as AchareSetupMode) ?? null;
    const currentStep = (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP) as AchareSetupStep) ?? null;
    const completedAt = (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_COMPLETED_AT) as string) ?? null;
    const setupVersion = (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_VERSION) as number) ?? null;

    const completedSteps: AchareSetupStep[] = [];

    if (userVars.get(AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED) === true) {
      completedSteps.push('BASIC_SETUP');
    }
    if (userVars.get(AchareSetupStepKeys.ACHARE_AGENCY_COMPLETED) === true) {
      completedSteps.push('AGENCY');
    }
    if (userVars.get(AchareSetupStepKeys.ACHARE_TEAM_COMPLETED) === true) {
      completedSteps.push('TEAM');
    }
    if (userVars.get(AchareSetupStepKeys.ACHARE_CRM_IMPORT_COMPLETED) === true) {
      completedSteps.push('CRM_IMPORT');
    }
    if (userVars.get(AchareSetupStepKeys.ACHARE_RECRUITMENT_COMPLETED) === true) {
      completedSteps.push('RECRUITMENT');
    }
    if (
      userVars.get(AchareSetupStepKeys.ACHARE_HR_COMPLETED) === true ||
      userVars.get(AchareSetupStepKeys.ACHARE_HR_SKIPPED) === true
    ) {
      completedSteps.push('HR');
    }
    if (
      userVars.get(AchareSetupStepKeys.ACHARE_PAYROLL_COMPLETED) === true ||
      userVars.get(AchareSetupStepKeys.ACHARE_PAYROLL_SKIPPED) === true
    ) {
      completedSteps.push('PAYROLL');
    }
    if (userVars.get(AchareSetupStepKeys.ACHARE_DASHBOARD_COMPLETED) === true) {
      completedSteps.push('DASHBOARD');
    }

    return {
      status,
      mode,
      currentStep,
      completedSteps,
      completedAt,
      setupVersion,
    };
  }

  async getStepStatuses({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<AchareSetupStepStatus[]> {
    const progress = await this.getSetupProgress({ userId, workspaceId });

    return ACHARE_SETUP_STEPS_ORDER.map((step) => {
      if (step === 'WELCOME') {
        return {
          step,
          status:
            progress.currentStep === 'WELCOME' && progress.status === 'IN_PROGRESS'
              ? 'IN_PROGRESS'
              : progress.completedSteps.includes('BASIC_SETUP')
                ? 'COMPLETED'
                : 'NOT_STARTED',
        };
      }

      if (progress.completedSteps.includes(step)) {
        return { step, status: 'COMPLETED' };
      }

      if (progress.currentStep === step) {
        return { step, status: 'IN_PROGRESS' };
      }

      return { step, status: 'NOT_STARTED' };
    });
  }

  async startOnboarding({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<void> {
    const existingStatus = await this.userVarsService.get({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_STATUS,
    });

    if (existingStatus === 'IN_PROGRESS') {
      return;
    }

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_STATUS,
      value: 'IN_PROGRESS',
    });

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP,
      value: 'WELCOME',
    });

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_VERSION,
      value: ACHARE_SETUP_CURRENT_VERSION,
    });
  }

  async advanceToStep({
    userId,
    workspaceId,
    step,
  }: {
    userId: string;
    workspaceId: string;
    step: AchareSetupStep;
  }): Promise<void> {
    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP,
      value: step,
    });
  }

  async completeStep({
    userId,
    workspaceId,
    step,
  }: {
    userId: string;
    workspaceId: string;
    step: AchareSetupStep;
  }): Promise<void> {
    const stepCompletionKeyMap: Partial<
      Record<AchareSetupStep, AchareSetupStepKeys>
    > = {
      BASIC_SETUP: AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED,
      AGENCY: AchareSetupStepKeys.ACHARE_AGENCY_COMPLETED,
      TEAM: AchareSetupStepKeys.ACHARE_TEAM_COMPLETED,
      CRM_IMPORT: AchareSetupStepKeys.ACHARE_CRM_IMPORT_COMPLETED,
      RECRUITMENT: AchareSetupStepKeys.ACHARE_RECRUITMENT_COMPLETED,
      DASHBOARD: AchareSetupStepKeys.ACHARE_DASHBOARD_COMPLETED,
    };

    const completionKey = stepCompletionKeyMap[step];

    if (isDefined(completionKey)) {
      await this.userVarsService.set({
        userId,
        workspaceId,
        key: completionKey,
        value: true,
      });
    }
  }

  async skipStep({
    userId,
    workspaceId,
    step,
  }: {
    userId: string;
    workspaceId: string;
    step: 'HR' | 'PAYROLL';
  }): Promise<void> {
    const skipKeyMap = {
      HR: AchareSetupStepKeys.ACHARE_HR_SKIPPED,
      PAYROLL: AchareSetupStepKeys.ACHARE_PAYROLL_SKIPPED,
    };

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: skipKeyMap[step],
      value: true,
    });

    await this.completeStep({ userId, workspaceId, step });
  }

  async setSetupMode({
    userId,
    workspaceId,
    mode,
  }: {
    userId: string;
    workspaceId: string;
    mode: AchareSetupMode;
  }): Promise<void> {
    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_MODE,
      value: mode,
    });
  }

  async finishOnboarding({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<void> {
    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_STATUS,
      value: 'COMPLETED',
    });

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_COMPLETED_AT,
      value: new Date().toISOString(),
    });

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: AchareSetupStepKeys.ACHARE_SETUP_VERSION,
      value: ACHARE_SETUP_CURRENT_VERSION,
    });
  }

  async getNextStep({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<AchareSetupStep | null> {
    const progress = await this.getSetupProgress({ userId, workspaceId });

    if (progress.status === 'COMPLETED') {
      return null;
    }

    const currentStepIndex = progress.currentStep
      ? ACHARE_SETUP_STEPS_ORDER.indexOf(progress.currentStep)
      : -1;

    for (let i = currentStepIndex + 1; i < ACHARE_SETUP_STEPS_ORDER.length; i++) {
      const candidateStep = ACHARE_SETUP_STEPS_ORDER[i];

      if (candidateStep === 'HR' && progress.mode === 'MANUAL') {
        continue;
      }
      if (candidateStep === 'PAYROLL' && progress.mode === 'MANUAL') {
        continue;
      }
      if (candidateStep === 'DASHBOARD' && progress.mode === 'MANUAL') {
        continue;
      }

      return candidateStep;
    }

    return null;
  }

  getOnboardingStatusFromAchareStep(
    step: AchareSetupStep,
  ): OnboardingStatus {
    const stepToStatusMap: Record<AchareSetupStep, OnboardingStatus> = {
      WELCOME: OnboardingStatus.ACHARE_WELCOME,
      BASIC_SETUP: OnboardingStatus.ACHARE_BASIC_SETUP,
      SETUP_CHOICE: OnboardingStatus.ACHARE_SETUP_CHOICE,
      AGENCY: OnboardingStatus.ACHARE_AGENCY,
      TEAM: OnboardingStatus.ACHARE_TEAM,
      CRM_IMPORT: OnboardingStatus.ACHARE_CRM_IMPORT,
      RECRUITMENT: OnboardingStatus.ACHARE_RECRUITMENT,
      HR: OnboardingStatus.ACHARE_HR,
      PAYROLL: OnboardingStatus.ACHARE_PAYROLL,
      DASHBOARD: OnboardingStatus.ACHARE_DASHBOARD,
      REVIEW: OnboardingStatus.ACHARE_REVIEW,
    };

    return stepToStatusMap[step];
  }
}
