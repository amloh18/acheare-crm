import { Injectable, Logger } from '@nestjs/common';

import {
  ACHARE_FEATURES,
  ACHARE_FEATURE_CONFIGURATION_VERSION,
  AchareFeatureKey,
  type AchareOnboardingStepKey,
  type AchareWorkspaceFeatureConfiguration,
  AchareModuleKey,
  getAchareDependentFeatures,
  getAchareOnboardingSteps,
  getDefaultAchareWorkspaceFeatureConfiguration,
  getEnabledAchareModules,
  getEnabledFeaturesForModule as getEnabledFeaturesForModuleFromCatalogue,
  isAchareFeatureEnabled,
  isAchareModuleEnabled,
  resolveAchareFeatureDependencies,
} from 'twenty-shared/workspace';

import { KeyValuePairType } from 'src/engine/core-modules/key-value-pair/key-value-pair.entity';
import { KeyValuePairService } from 'src/engine/core-modules/key-value-pair/key-value-pair.service';
import { ACHARE_WORKSPACE_FEATURE_CONFIG_KEY } from 'src/engine/core-modules/workspace-feature/constants/achare-workspace-feature-config-key.constant';
import { type AchareWorkspaceFeatureConfigKeyValueTypesMap } from 'src/engine/core-modules/workspace-feature/types/achare-workspace-feature-config-map.type';
import {
  WorkspaceFeatureException,
  WorkspaceFeatureExceptionCode,
} from 'src/engine/core-modules/workspace-feature/workspace-feature.exception';

export type AchareSetupStatus = {
  enabledFeatures: AchareFeatureKey[];
  enabledModules: AchareModuleKey[];
  onboardingSteps: AchareOnboardingStepKey[];
  setupVersion: number;
};

@Injectable()
export class WorkspaceFeatureService {
  private readonly logger = new Logger(WorkspaceFeatureService.name);

  constructor(
    private readonly keyValuePairService: KeyValuePairService<AchareWorkspaceFeatureConfigKeyValueTypesMap>,
  ) {}

  /**
   * Reads the stored configuration row. `KeyValuePairService.get` returns the
   * row entity with its `value` merged in, so we narrow it to the field we use.
   */
  private async readStoredConfiguration(
    workspaceId: string,
  ): Promise<AchareWorkspaceFeatureConfiguration | null> {
    const rows = (await this.keyValuePairService.get({
      type: KeyValuePairType.CONFIG_VARIABLE,
      userId: null,
      workspaceId,
      key: ACHARE_WORKSPACE_FEATURE_CONFIG_KEY,
    })) as unknown as Array<{
      value: AchareWorkspaceFeatureConfiguration | null;
    }>;

    return rows[0]?.value ?? null;
  }

  private async writeConfiguration(
    workspaceId: string,
    configuration: AchareWorkspaceFeatureConfiguration,
  ): Promise<void> {
    await this.keyValuePairService.set({
      userId: null,
      workspaceId,
      key: ACHARE_WORKSPACE_FEATURE_CONFIG_KEY,
      value: configuration,
      type: KeyValuePairType.CONFIG_VARIABLE,
    });
  }

  private assertValidFeatureKey(feature: AchareFeatureKey): void {
    if (ACHARE_FEATURES[feature] === undefined) {
      throw new WorkspaceFeatureException(
        `Unknown Achare feature key: ${feature}`,
        WorkspaceFeatureExceptionCode.INVALID_FEATURE_KEY,
      );
    }
  }

  /**
   * Returns the workspace feature configuration, falling back to the safe
   * default (everything enabled) for workspaces that predate this feature or
   * have not been configured yet — never auto-disabling existing functionality.
   */
  async getConfiguration(
    workspaceId: string,
  ): Promise<AchareWorkspaceFeatureConfiguration> {
    const storedConfiguration = await this.readStoredConfiguration(workspaceId);

    if (storedConfiguration === null) {
      return getDefaultAchareWorkspaceFeatureConfiguration();
    }

    if (
      storedConfiguration.setupVersion !== ACHARE_FEATURE_CONFIGURATION_VERSION
    ) {
      this.logger.warn(
        `Workspace ${workspaceId} has feature configuration version ${storedConfiguration.setupVersion}, current is ${ACHARE_FEATURE_CONFIGURATION_VERSION}. Keeping features, updating version.`,
      );

      const migratedConfiguration: AchareWorkspaceFeatureConfiguration = {
        ...storedConfiguration,
        setupVersion: ACHARE_FEATURE_CONFIGURATION_VERSION,
        updatedAt: new Date().toISOString(),
      };

      await this.writeConfiguration(workspaceId, migratedConfiguration);

      return migratedConfiguration;
    }

    return storedConfiguration;
  }

  async getEnabledFeatures(workspaceId: string): Promise<AchareFeatureKey[]> {
    const configuration = await this.getConfiguration(workspaceId);

    return configuration.enabledFeatures;
  }

  async isFeatureEnabled(
    workspaceId: string,
    feature: AchareFeatureKey,
  ): Promise<boolean> {
    return isAchareFeatureEnabled(
      await this.getEnabledFeatures(workspaceId),
      feature,
    );
  }

  async getEnabledModules(workspaceId: string): Promise<AchareModuleKey[]> {
    return getEnabledAchareModules(await this.getEnabledFeatures(workspaceId));
  }

  async isModuleEnabled(
    workspaceId: string,
    module: AchareModuleKey,
  ): Promise<boolean> {
    return isAchareModuleEnabled(
      await this.getEnabledFeatures(workspaceId),
      module,
    );
  }

  async getEnabledFeaturesForModule(
    workspaceId: string,
    module: AchareModuleKey,
  ): Promise<AchareFeatureKey[]> {
    return getEnabledFeaturesForModuleFromCatalogue(
      await this.getEnabledFeatures(workspaceId),
      module,
    );
  }

  /**
   * Replaces the enabled feature set. Dependencies are resolved centrally, so
   * requesting Payroll also enables Employees and Salary. Idempotent: the same
   * selection always produces the same stored configuration.
   */
  async setEnabledFeatures({
    workspaceId,
    features,
    featureSettings,
    presetKey,
  }: {
    workspaceId: string;
    features: AchareFeatureKey[];
    featureSettings?: AchareWorkspaceFeatureConfiguration['featureSettings'];
    presetKey?: string;
  }): Promise<AchareWorkspaceFeatureConfiguration> {
    features.forEach((feature) => this.assertValidFeatureKey(feature));

    const resolvedFeatures = resolveAchareFeatureDependencies(features);
    const existingConfiguration = await this.getConfiguration(workspaceId);

    const configuration: AchareWorkspaceFeatureConfiguration = {
      enabledFeatures: resolvedFeatures,
      presetKey: presetKey ?? existingConfiguration.presetKey,
      featureSettings:
        featureSettings ?? existingConfiguration.featureSettings ?? {},
      setupVersion: ACHARE_FEATURE_CONFIGURATION_VERSION,
      updatedAt: new Date().toISOString(),
    };

    await this.writeConfiguration(workspaceId, configuration);

    return configuration;
  }

  async enableFeature({
    workspaceId,
    feature,
  }: {
    workspaceId: string;
    feature: AchareFeatureKey;
  }): Promise<AchareWorkspaceFeatureConfiguration> {
    this.assertValidFeatureKey(feature);

    const enabledFeatures = await this.getEnabledFeatures(workspaceId);

    return this.setEnabledFeatures({
      workspaceId,
      features: [...enabledFeatures, feature],
    });
  }

  /**
   * Disables a feature. This is visibility/activation only — it never deletes
   * the underlying data, which stays intact and can be re-enabled later.
   *
   * If other enabled features depend on this one, the call is rejected unless
   * `cascade` is set, in which case the dependents are disabled too.
   */
  async disableFeature({
    workspaceId,
    feature,
    cascade = false,
  }: {
    workspaceId: string;
    feature: AchareFeatureKey;
    cascade?: boolean;
  }): Promise<AchareWorkspaceFeatureConfiguration> {
    this.assertValidFeatureKey(feature);

    const enabledFeatures = await this.getEnabledFeatures(workspaceId);
    const dependentFeatures = getAchareDependentFeatures(
      feature,
      enabledFeatures,
    );

    if (dependentFeatures.length > 0 && !cascade) {
      throw new WorkspaceFeatureException(
        `Cannot disable ${feature}: required by ${dependentFeatures.join(', ')}`,
        WorkspaceFeatureExceptionCode.FEATURE_HAS_DEPENDENTS,
      );
    }

    const featuresToDisable = new Set<AchareFeatureKey>([
      feature,
      ...dependentFeatures,
    ]);

    return this.setEnabledFeatures({
      workspaceId,
      features: enabledFeatures.filter(
        (enabledFeature) => !featuresToDisable.has(enabledFeature),
      ),
    });
  }

  /**
   * The onboarding steps this workspace should see, derived from its enabled
   * features.
   */
  async getOnboardingSteps(
    workspaceId: string,
  ): Promise<AchareOnboardingStepKey[]> {
    return getAchareOnboardingSteps(await this.getEnabledFeatures(workspaceId));
  }

  async getSetupStatus(workspaceId: string): Promise<AchareSetupStatus> {
    const configuration = await this.getConfiguration(workspaceId);

    return {
      enabledFeatures: configuration.enabledFeatures,
      enabledModules: getEnabledAchareModules(configuration.enabledFeatures),
      onboardingSteps: getAchareOnboardingSteps(configuration.enabledFeatures),
      setupVersion: configuration.setupVersion,
    };
  }
}
