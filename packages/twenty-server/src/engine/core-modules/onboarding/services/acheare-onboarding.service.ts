import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import {
  ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS,
  getNextAchareOnboardingStep,
  type AchareOnboardingStepKey,
} from 'twenty-shared/workspace';
import { Repository } from 'typeorm';

import {
  AchareSetupStepKeys,
  ACHARE_SETUP_CURRENT_VERSION,
  type AchareSetupMode,
  type AchareSetupStatus,
  type AchareSetupStep,
} from 'src/engine/core-modules/onboarding/constants/acheare-setup-step-keys';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import {
  OnboardingException,
  OnboardingExceptionCode,
} from 'src/engine/core-modules/onboarding/onboarding.exception';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceFeatureService } from 'src/engine/core-modules/workspace-feature/services/workspace-feature.service';

export type AchareSetupKeyValueTypeMap = {
  [AchareSetupStepKeys.ACHARE_SETUP_STATUS]: AchareSetupStatus;
  [AchareSetupStepKeys.ACHARE_SETUP_MODE]: AchareSetupMode;
  [AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP]: AchareSetupStep;
  [AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_SETUP_CHOICE_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_FEATURE_SELECTION_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_AGENCY_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_TEAM_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_CRM_IMPORT_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_RECRUITMENT_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_HR_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_HR_SKIPPED]: boolean;
  [AchareSetupStepKeys.ACHARE_PAYROLL_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_PAYROLL_SKIPPED]: boolean;
  [AchareSetupStepKeys.ACHARE_FINANCE_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_FINANCE_SKIPPED]: boolean;
  [AchareSetupStepKeys.ACHARE_DOCUMENTS_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_DOCUMENTS_SKIPPED]: boolean;
  [AchareSetupStepKeys.ACHARE_DASHBOARD_COMPLETED]: boolean;
  [AchareSetupStepKeys.ACHARE_SETUP_COMPLETED_AT]: string;
  [AchareSetupStepKeys.ACHARE_SETUP_VERSION]: number;
};

/**
 * The step each completion key records. Steps absent from this map (WELCOME,
 * REVIEW) are not "completed" — they are entry and exit points.
 */
const ACHARE_STEP_COMPLETION_KEYS: Partial<
  Record<AchareSetupStep, AchareSetupStepKeys>
> = {
  BASIC_SETUP: AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED,
  SETUP_CHOICE: AchareSetupStepKeys.ACHARE_SETUP_CHOICE_COMPLETED,
  FEATURE_SELECTION: AchareSetupStepKeys.ACHARE_FEATURE_SELECTION_COMPLETED,
  AGENCY: AchareSetupStepKeys.ACHARE_AGENCY_COMPLETED,
  TEAM: AchareSetupStepKeys.ACHARE_TEAM_COMPLETED,
  CRM_IMPORT: AchareSetupStepKeys.ACHARE_CRM_IMPORT_COMPLETED,
  RECRUITMENT: AchareSetupStepKeys.ACHARE_RECRUITMENT_COMPLETED,
  HR: AchareSetupStepKeys.ACHARE_HR_COMPLETED,
  PAYROLL: AchareSetupStepKeys.ACHARE_PAYROLL_COMPLETED,
  DASHBOARD: AchareSetupStepKeys.ACHARE_DASHBOARD_COMPLETED,
  FINANCE: AchareSetupStepKeys.ACHARE_FINANCE_COMPLETED,
  DOCUMENTS: AchareSetupStepKeys.ACHARE_DOCUMENTS_COMPLETED,
};

/** Steps that may be skipped, and the key recording the skip. */
const ACHARE_STEP_SKIP_KEYS: Partial<
  Record<AchareSetupStep, AchareSetupStepKeys>
> = {
  HR: AchareSetupStepKeys.ACHARE_HR_SKIPPED,
  PAYROLL: AchareSetupStepKeys.ACHARE_PAYROLL_SKIPPED,
  FINANCE: AchareSetupStepKeys.ACHARE_FINANCE_SKIPPED,
  DOCUMENTS: AchareSetupStepKeys.ACHARE_DOCUMENTS_SKIPPED,
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
    private readonly workspaceFeatureService: WorkspaceFeatureService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  /**
   * The steps this workspace's wizard contains, generated from its enabled
   * features. This replaced the fixed `ACHARE_SETUP_STEPS_ORDER`: the order and
   * the membership of the wizard are now both derived, so no caller needs a
   * hardcoded chain.
   */
  async getStepOrder(workspaceId: string): Promise<AchareSetupStep[]> {
    return this.workspaceFeatureService.getOnboardingSteps(workspaceId);
  }

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

    return this.getOnboardingStatusFromAchareStep(currentStep);
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
      (userVars.get(
        AchareSetupStepKeys.ACHARE_SETUP_STATUS,
      ) as AchareSetupStatus) ?? 'NOT_STARTED';
    const mode =
      (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_MODE) as AchareSetupMode) ??
      null;
    const currentStep =
      (userVars.get(
        AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP,
      ) as AchareSetupStep) ?? null;
    const completedAt =
      (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_COMPLETED_AT) as string) ??
      null;
    const setupVersion =
      (userVars.get(AchareSetupStepKeys.ACHARE_SETUP_VERSION) as number) ?? null;

    const completedSteps = Object.entries(ACHARE_STEP_COMPLETION_KEYS)
      .filter(([, completionKey]) => userVars.get(completionKey) === true)
      .map(([step]) => step as AchareSetupStep);

    for (const [step, skipKey] of Object.entries(ACHARE_STEP_SKIP_KEYS)) {
      if (
        userVars.get(skipKey) === true &&
        !completedSteps.includes(step as AchareSetupStep)
      ) {
        completedSteps.push(step as AchareSetupStep);
      }
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
    const [progress, stepOrder] = await Promise.all([
      this.getSetupProgress({ userId, workspaceId }),
      this.getStepOrder(workspaceId),
    ]);

    return stepOrder.map((step) => {
      if (step === 'WELCOME') {
        return {
          step,
          status:
            progress.currentStep === 'WELCOME' &&
            progress.status === 'IN_PROGRESS'
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

    // Starting is idempotent: an onboarding already under way keeps its
    // position, and a completed one is not silently rewound to WELCOME.
    if (existingStatus === 'IN_PROGRESS' || existingStatus === 'COMPLETED') {
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
    const completionKey = ACHARE_STEP_COMPLETION_KEYS[step];

    if (!isDefined(completionKey)) {
      return;
    }

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: completionKey,
      value: true,
    });
  }

  /**
   * Marks a step skipped and completed in one go, so the wizard moves on and
   * the step is not offered again. Only steps with a skip key can be skipped —
   * asking to skip a step that has none is a caller bug, and is rejected rather
   * than silently marking it complete.
   */
  async skipStep({
    userId,
    workspaceId,
    step,
  }: {
    userId: string;
    workspaceId: string;
    step: AchareSetupStep;
  }): Promise<void> {
    const skipKey = ACHARE_STEP_SKIP_KEYS[step];

    if (!isDefined(skipKey)) {
      throw new OnboardingException(
        `Step ${step} cannot be skipped`,
        OnboardingExceptionCode.STEP_NOT_SKIPPABLE,
      );
    }

    await this.userVarsService.set({
      userId,
      workspaceId,
      key: skipKey,
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

    await Promise.all([
      this.userVarsService.delete({
        userId,
        workspaceId,
        key: 'ONBOARDING_CREATE_PROFILE_PENDING' as never,
      }),
      this.userVarsService.delete({
        userId,
        workspaceId,
        key: 'ONBOARDING_CONNECT_ACCOUNT_PENDING' as never,
      }),
      this.userVarsService.delete({
        userId,
        workspaceId,
        key: 'ONBOARDING_INSTALL_APPS_PENDING' as never,
      }),
      this.userVarsService.delete({
        userId,
        workspaceId,
        key: 'ONBOARDING_INVITE_TEAM_PENDING' as never,
      }),
      this.userVarsService.delete({
        userId,
        workspaceId,
        key: 'ONBOARDING_BOOK_CALL_PENDING' as never,
      }),
    ]);
  }

  /**
   * The step that follows the current one in *this workspace's* generated step
   * list. Returns `null` when the wizard is finished.
   *
   * MANUAL mode deliberately stops after the fixed steps: the user asked to
   * configure the product themselves, so module setup steps are not walked.
   */
  async getNextStep({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<AchareSetupStep | null> {
    const [progress, stepOrder] = await Promise.all([
      this.getSetupProgress({ userId, workspaceId }),
      this.getStepOrder(workspaceId),
    ]);

    if (progress.status === 'COMPLETED') {
      return null;
    }

    const nextStep = getNextAchareOnboardingStep(
      stepOrder,
      progress.currentStep,
    );

    if (nextStep === null) {
      return null;
    }

    if (progress.mode === 'MANUAL' && this.isModuleStep(nextStep)) {
      return 'REVIEW';
    }

    return nextStep;
  }

  private isModuleStep(step: AchareSetupStep): boolean {
    return !['WELCOME', 'BASIC_SETUP', 'SETUP_CHOICE', 'FEATURE_SELECTION', 'AGENCY', 'REVIEW'].includes(
      step,
    );
  }

  getOnboardingStatusFromAchareStep(step: AchareSetupStep): OnboardingStatus {
    const status = ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS[step];

    return (
      (status as OnboardingStatus | undefined) ?? OnboardingStatus.ACHARE_WELCOME
    );
  }
}
