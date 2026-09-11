import { ACHARE_FEATURE_DEFINITIONS } from '../constants/AchareFeatures';
import { ACHARE_FEATURE_CONFIGURATION_VERSION } from '../constants/AchareFeatureConfigurationVersion';
import { type AchareFeatureKey } from '../types/AchareFeatureKey';
import { type AchareWorkspaceFeatureConfiguration } from '../types/AchareWorkspaceFeatureConfiguration';

/**
 * The default feature set for a workspace that has no stored configuration.
 *
 * For existing Achare workspaces the safe default is "everything on": we must
 * never auto-disable functionality a customer may already be using. A later
 * phase refines this by inferring enabled features from data actually present
 * (see the migration strategy in `ACHEARE-PHASE0-AUDIT.md`).
 */
export const getDefaultAchareWorkspaceFeatures = (): AchareFeatureKey[] =>
  ACHARE_FEATURE_DEFINITIONS.map((definition) => definition.key);

/**
 * Builds the default workspace feature configuration.
 */
export const getDefaultAchareWorkspaceFeatureConfiguration =
  (): AchareWorkspaceFeatureConfiguration => ({
    enabledFeatures: getDefaultAchareWorkspaceFeatures(),
    setupVersion: ACHARE_FEATURE_CONFIGURATION_VERSION,
    updatedAt: new Date().toISOString(),
  });
