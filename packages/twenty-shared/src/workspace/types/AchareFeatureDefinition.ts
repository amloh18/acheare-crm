import { type AchareFeatureKey } from './AchareFeatureKey';
import { type AchareModuleKey } from './AchareModuleKey';

/**
 * Describes a single Achare product feature.
 *
 * `standardObjectKey` and `navigationMenuItemKey` reference the real
 * Twenty/Achare standard objects and navigation menu items so that downstream
 * consumers (navigation, search, command menu, dashboards) can resolve a
 * feature to concrete workspace metadata without a second lookup table.
 */
export type AchareFeatureDefinition = {
  key: AchareFeatureKey;
  moduleKey: AchareModuleKey;
  /** Human-readable label shown in feature-selection UI. */
  label: string;
  /** Short value explanation shown under the label. */
  description: string;
  /** Twenty icon identifier. */
  icon: string;
  /** Key of the backing entry in `STANDARD_OBJECTS`, when object-backed. */
  standardObjectKey?: string;
  /** Key of the standard navigation menu item that surfaces this feature. */
  navigationMenuItemKey?: string;
};
