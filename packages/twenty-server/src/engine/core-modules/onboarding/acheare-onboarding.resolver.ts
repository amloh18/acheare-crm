import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { AchareDashboardProvisioningService } from 'src/engine/core-modules/onboarding/services/acheare-dashboard-provisioning.service';
import { AchareOnboardingService } from 'src/engine/core-modules/onboarding/services/acheare-onboarding.service';
import {
  AchareSetupProgressDTO,
  AchareSetupSuccessDTO,
} from 'src/engine/core-modules/onboarding/dtos/acheare-setup-status.dto';
import {
  AchareBasicSetupInputDTO,
  AchareAgencySetupInputDTO,
  AchareTeamSetupInputDTO,
  AchareCrmImportInputDTO,
  AchareRecruitmentSetupInputDTO,
  AchareHrSetupInputDTO,
  AcharePayrollSetupInputDTO,
  AchareFeatureSelectionInputDTO,
  AchareModuleSetupInputDTO,
  AchareDashboardSetupInputDTO,
} from 'src/engine/core-modules/onboarding/dtos/acheare-setup-inputs.dto';
import { type AchareSetupStep } from 'src/engine/core-modules/onboarding/constants/acheare-setup-step-keys';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceFeatureService } from 'src/engine/core-modules/workspace-feature/services/workspace-feature.service';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { PermissionFlagType } from 'twenty-shared/constants';
import { type AchareFeatureKey } from 'twenty-shared/workspace';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class AchareOnboardingResolver {
  constructor(
    private readonly achareOnboardingService: AchareOnboardingService,
    private readonly dashboardProvisioningService: AchareDashboardProvisioningService,
    private readonly workspaceFeatureService: WorkspaceFeatureService,
  ) {}

  /**
   * Moves to the step that follows the current one in *this workspace's*
   * generated step list, and returns it. Every completion mutation funnels
   * through here, so no mutation needs to know the wizard's shape — enabling
   * or disabling a module changes the order without touching the resolver.
   */
  private async advanceToNextStep({
    userId,
    workspaceId,
  }: {
    userId: string;
    workspaceId: string;
  }): Promise<AchareSetupStep | null> {
    const nextStep = await this.achareOnboardingService.getNextStep({
      userId,
      workspaceId,
    });

    if (nextStep === null) {
      return null;
    }

    await this.achareOnboardingService.advanceToStep({
      userId,
      workspaceId,
      step: nextStep,
    });

    return nextStep;
  }

  @Query(() => AchareSetupProgressDTO)
  async acheareSetupProgress(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AchareSetupProgressDTO> {
    const progress = await this.achareOnboardingService.getSetupProgress({
      userId: user.id,
      workspaceId: workspace.id,
    });

    const stepStatuses = await this.achareOnboardingService.getStepStatuses({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return {
      ...progress,
      stepStatuses: stepStatuses.map((s) => ({
        step: s.step,
        status: s.status,
      })),
    };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async startAchareOnboarding(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.startOnboarding({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return {
      success: true,
      currentStep: 'WELCOME',
    };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareBasicSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareBasicSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.agencyName) {
      await this.achareOnboardingService['workspaceRepository'].update(
        workspace.id,
        { displayName: input.agencyName },
      );
    }

    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'BASIC_SETUP',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async setAchareSetupMode(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('mode') mode: string,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.setSetupMode({
      userId: user.id,
      workspaceId: workspace.id,
      mode: mode as 'GUIDED' | 'MANUAL',
    });

    if (mode === 'MANUAL') {
      await this.achareOnboardingService.finishOnboarding({
        userId: user.id,
        workspaceId: workspace.id,
      });

      return { success: true, currentStep: null };
    }

    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'SETUP_CHOICE',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  /**
   * Persists the workspace's feature composition. This is the step that makes
   * the rest of onboarding dynamic: the steps that follow are generated from
   * whatever is selected here.
   */
  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareFeatureSelection(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareFeatureSelectionInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    await this.workspaceFeatureService.setEnabledFeatures({
      workspaceId: workspace.id,
      features: input.features as AchareFeatureKey[],
      presetKey: input.presetKey,
    });

    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'FEATURE_SELECTION',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareAgencySetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareAgencySetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'AGENCY',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareTeamSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareTeamSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'TEAM',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareCrmImport(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareCrmImportInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'CRM_IMPORT',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareRecruitmentSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareRecruitmentSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'RECRUITMENT',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareHrSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareHrSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.skipSetup) {
      await this.achareOnboardingService.skipStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'HR',
      });
    } else {
      await this.achareOnboardingService.completeStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'HR',
      });
    }

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAcharePayrollSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AcharePayrollSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.skipSetup) {
      await this.achareOnboardingService.skipStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'PAYROLL',
      });
    } else {
      await this.achareOnboardingService.completeStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'PAYROLL',
      });
    }

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareFinanceSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareModuleSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.skipSetup) {
      await this.achareOnboardingService.skipStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'FINANCE',
      });
    } else {
      await this.achareOnboardingService.completeStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'FINANCE',
      });
    }

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareDocumentsSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareModuleSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.skipSetup) {
      await this.achareOnboardingService.skipStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'DOCUMENTS',
      });
    } else {
      await this.achareOnboardingService.completeStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: 'DOCUMENTS',
      });
    }

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareDashboardSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareDashboardSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.provisionDefaults) {
      // Only create the dashboards whose modules this workspace actually has.
      const enabledFeatures =
        await this.workspaceFeatureService.getEnabledFeatures(workspace.id);

      await this.dashboardProvisioningService.provisionDashboards({
        workspaceId: workspace.id,
        config: {
          dashboardTypes: input.dashboardTypes ?? [
            'Management',
            'BDE',
            'HR',
            'Recruiter',
          ],
        },
        enabledFeatures,
      });
    }

    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'DASHBOARD',
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async finishAchareOnboarding(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.finishOnboarding({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return {
      success: true,
      currentStep: null,
    };
  }

  /**
   * Skips a step and moves on. Skippability is decided by the service (only
   * module steps with a skip key can be skipped), so an unknown or
   * non-skippable step is rejected rather than silently completing.
   */
  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async skipAchareSetupStep(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('step') step: string,
  ): Promise<AchareSetupSuccessDTO> {
    await this.achareOnboardingService.skipStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: step as AchareSetupStep,
    });

    const currentStep = await this.advanceToNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    return { success: true, currentStep };
  }
}
