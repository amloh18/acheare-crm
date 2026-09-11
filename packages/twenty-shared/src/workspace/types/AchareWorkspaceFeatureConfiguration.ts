import { type AchareFeatureKey } from './AchareFeatureKey';

/**
 * The persisted, workspace-level Achare feature configuration.
 *
 * Stored server-side as a workspace-scoped key/value pair (userId = null,
 * type = CONFIG_VARIABLE) so it survives reloads, is shared by every member of
 * the workspace, and is not tied to the admin who configured it.
 *
 * This is configuration, not a security boundary: disabled features hide UI
 * but must never be relied on for authorization.
 */
export type AchareWorkspaceFeatureConfiguration = {
  /** Features the workspace admin has explicitly enabled. */
  enabledFeatures: AchareFeatureKey[];
  /**
   * The preset the selection started from, when one was used. Kept so the
   * Setup Center can show how the workspace was composed and offer a reset to
   * the preset; it never affects what is enabled.
   */
  presetKey?: string;
  /** Per-feature configuration payload, keyed by feature. */
  featureSettings?: Partial<Record<AchareFeatureKey, Record<string, unknown>>>;
  /** Version of the feature-configuration schema, for future migrations. */
  setupVersion: number;
  /** ISO timestamp of the last change. */
  updatedAt: string;
};
