/**
 * Key under which a workspace's Achare feature configuration is stored.
 *
 * Stored as a workspace-scoped key/value pair (userId = null,
 * type = CONFIG_VARIABLE) in the existing `keyValuePair` table, so no new
 * table or migration is required and the configuration is shared by every
 * member of the workspace.
 */
export const ACHARE_WORKSPACE_FEATURE_CONFIG_KEY =
  'ACHARE_WORKSPACE_FEATURES' as const;
