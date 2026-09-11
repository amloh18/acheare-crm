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
  AchareDashboardSetupInputDTO,
} from 'src/engine/core-modules/onboarding/dtos/acheare-setup-inputs.dto';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { PermissionFlagType } from 'twenty-shared/constants';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class AchareOnboardingResolver {
  constructor(
    private readonly achareOnboardingService: AchareOnboardingService,
    private readonly dashboardProvisioningService: AchareDashboardProvisioningService,
  ) {}

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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'SETUP_CHOICE',
    });

    return {
      success: true,
      currentStep: 'SETUP_CHOICE',
    };
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

      return {
        success: true,
        currentStep: null,
      };
    }

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'AGENCY',
    });

    return {
      success: true,
      currentStep: 'AGENCY',
    };
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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'TEAM',
    });

    return {
      success: true,
      currentStep: 'TEAM',
    };
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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'CRM_IMPORT',
    });

    return {
      success: true,
      currentStep: 'CRM_IMPORT',
    };
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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'RECRUITMENT',
    });

    return {
      success: true,
      currentStep: 'RECRUITMENT',
    };
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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'HR',
    });

    return {
      success: true,
      currentStep: 'HR',
    };
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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'PAYROLL',
    });

    return {
      success: true,
      currentStep: 'PAYROLL',
    };
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

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'DASHBOARD',
    });

    return {
      success: true,
      currentStep: 'DASHBOARD',
    };
  }

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async completeAchareDashboardSetup(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: AchareDashboardSetupInputDTO,
  ): Promise<AchareSetupSuccessDTO> {
    if (input.provisionDefaults) {
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
      });
    }

    await this.achareOnboardingService.completeStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'DASHBOARD',
    });

    await this.achareOnboardingService.advanceToStep({
      userId: user.id,
      workspaceId: workspace.id,
      step: 'REVIEW',
    });

    return {
      success: true,
      currentStep: 'REVIEW',
    };
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

  @Mutation(() => AchareSetupSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async skipAchareSetupStep(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('step') step: string,
  ): Promise<AchareSetupSuccessDTO> {
    const validSkipSteps = ['HR', 'PAYROLL', 'CRM_IMPORT'];

    if (!validSkipSteps.includes(step)) {
      return {
        success: false,
        currentStep: null,
      };
    }

    if (step === 'HR' || step === 'PAYROLL') {
      await this.achareOnboardingService.skipStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: step as 'HR' | 'PAYROLL',
      });
    } else {
      await this.achareOnboardingService.completeStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: step as 'CRM_IMPORT',
      });
    }

    const nextStep = await this.achareOnboardingService.getNextStep({
      userId: user.id,
      workspaceId: workspace.id,
    });

    if (nextStep) {
      await this.achareOnboardingService.advanceToStep({
        userId: user.id,
        workspaceId: workspace.id,
        step: nextStep,
      });
    }

    return {
      success: true,
      currentStep: nextStep,
    };
  }
}
