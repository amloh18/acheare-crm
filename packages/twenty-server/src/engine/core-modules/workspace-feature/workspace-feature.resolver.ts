import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { PermissionFlagType } from 'twenty-shared/constants';
import {
  ACHARE_FEATURE_DEFINITIONS,
  ACHARE_MODULE_ORDER,
  ACHARE_MODULES,
  AchareFeatureKey,
  getAchareOnboardingSteps,
} from 'twenty-shared/workspace';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import {
  AchareFeatureDTO,
  AchareModuleDTO,
  AchareWorkspaceFeatureConfigurationDTO,
  AchareWorkspaceFeatureMutationSuccessDTO,
  DisableAchareWorkspaceFeatureInput,
  SetAchareWorkspaceFeaturesInput,
} from 'src/engine/core-modules/workspace-feature/dtos/workspace-feature.dto';
import { WorkspaceFeatureService } from 'src/engine/core-modules/workspace-feature/services/workspace-feature.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { SettingsPermissionGuard } from 'src/engine/guards/settings-permission.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class WorkspaceFeatureResolver {
  constructor(
    private readonly workspaceFeatureService: WorkspaceFeatureService,
  ) {}

  private buildModuleDTOs(
    enabledFeatures: AchareFeatureKey[],
  ): AchareModuleDTO[] {
    return ACHARE_MODULE_ORDER.map((moduleKey) => {
      const module = ACHARE_MODULES[moduleKey];

      const features: AchareFeatureDTO[] = module.features.map((featureKey) => {
        const definition =
          ACHARE_FEATURE_DEFINITIONS.find(
            (candidate) => candidate.key === featureKey,
          ) ?? null;

        return {
          key: featureKey,
          moduleKey,
          label: definition?.label ?? featureKey,
          description: definition?.description ?? '',
          icon: definition?.icon ?? 'IconCircle',
          enabled: enabledFeatures.includes(featureKey),
          standardObjectKey: definition?.standardObjectKey ?? null,
          navigationMenuItemKey: definition?.navigationMenuItemKey ?? null,
        };
      });

      return {
        key: moduleKey,
        label: module.label,
        description: module.description,
        icon: module.icon,
        position: module.position,
        enabled: features.some((feature) => feature.enabled),
        features,
      };
    });
  }

  private buildConfigurationDTO(
    enabledFeatures: AchareFeatureKey[],
    setupVersion: number,
  ): AchareWorkspaceFeatureConfigurationDTO {
    return {
      enabledFeatures,
      enabledModules: ACHARE_MODULE_ORDER.filter((moduleKey) =>
        ACHARE_MODULES[moduleKey].features.some((featureKey) =>
          enabledFeatures.includes(featureKey),
        ),
      ),
      onboardingSteps: getAchareOnboardingSteps(enabledFeatures),
      setupVersion,
      modules: this.buildModuleDTOs(enabledFeatures),
    };
  }

  @Query(() => AchareWorkspaceFeatureConfigurationDTO)
  async workspaceFeatureConfiguration(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AchareWorkspaceFeatureConfigurationDTO> {
    const configuration = await this.workspaceFeatureService.getConfiguration(
      workspace.id,
    );

    return this.buildConfigurationDTO(
      configuration.enabledFeatures,
      configuration.setupVersion,
    );
  }

  @Mutation(() => AchareWorkspaceFeatureMutationSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async setWorkspaceFeatures(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: SetAchareWorkspaceFeaturesInput,
  ): Promise<AchareWorkspaceFeatureMutationSuccessDTO> {
    const configuration = await this.workspaceFeatureService.setEnabledFeatures(
      {
        workspaceId: workspace.id,
        features: input.features,
      },
    );

    return {
      success: true,
      enabledFeatures: configuration.enabledFeatures,
    };
  }

  @Mutation(() => AchareWorkspaceFeatureMutationSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async enableWorkspaceFeature(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('feature', { type: () => AchareFeatureKey })
    feature: AchareFeatureKey,
  ): Promise<AchareWorkspaceFeatureMutationSuccessDTO> {
    const configuration = await this.workspaceFeatureService.enableFeature({
      workspaceId: workspace.id,
      feature,
    });

    return {
      success: true,
      enabledFeatures: configuration.enabledFeatures,
    };
  }

  @Mutation(() => AchareWorkspaceFeatureMutationSuccessDTO)
  @UseGuards(SettingsPermissionGuard(PermissionFlagType.WORKSPACE))
  async disableWorkspaceFeature(
    @AuthWorkspace() workspace: WorkspaceEntity,
    @Args('input') input: DisableAchareWorkspaceFeatureInput,
  ): Promise<AchareWorkspaceFeatureMutationSuccessDTO> {
    const configuration = await this.workspaceFeatureService.disableFeature({
      workspaceId: workspace.id,
      feature: input.feature,
      cascade: input.cascade ?? false,
    });

    return {
      success: true,
      enabledFeatures: configuration.enabledFeatures,
    };
  }
}
