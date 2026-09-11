import { type AchareWorkspaceFeatureConfiguration } from 'twenty-shared/workspace';

import { ACHARE_WORKSPACE_FEATURE_CONFIG_KEY } from 'src/engine/core-modules/workspace-feature/constants/achare-workspace-feature-config-key.constant';

/**
 * Typed key/value map for the workspace-scoped feature configuration row.
 */
export type AchareWorkspaceFeatureConfigKeyValueTypesMap = {
  [ACHARE_WORKSPACE_FEATURE_CONFIG_KEY]: AchareWorkspaceFeatureConfiguration;
};
