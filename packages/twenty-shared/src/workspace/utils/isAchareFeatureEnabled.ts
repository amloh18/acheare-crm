import { ACHARE_FEATURES } from '../constants/AchareFeatures';
import { ACHARE_MODULES } from '../constants/AchareModules';
import { type AchareFeatureKey } from '../types/AchareFeatureKey';
import { type AchareModuleKey } from '../types/AchareModuleKey';

/**
 * Whether a feature is enabled in a workspace, given its enabled feature list.
 */
export const isAchareFeatureEnabled = (
  enabledFeatures: AchareFeatureKey[],
  feature: AchareFeatureKey,
): boolean => enabledFeatures.includes(feature);

/**
 * Whether a module is visible, i.e. at least one of its features is enabled.
 */
export const isAchareModuleEnabled = (
  enabledFeatures: AchareFeatureKey[],
  module: AchareModuleKey,
): boolean =>
  ACHARE_MODULES[module].features.some((feature) =>
    enabledFeatures.includes(feature),
  );

/**
 * The features of a module that are enabled.
 */
export const getEnabledFeaturesForModule = (
  enabledFeatures: AchareFeatureKey[],
  module: AchareModuleKey,
): AchareFeatureKey[] =>
  ACHARE_MODULES[module].features.filter((feature) =>
    enabledFeatures.includes(feature),
  );

/**
 * The modules that have at least one enabled feature.
 */
export const getEnabledAchareModules = (
  enabledFeatures: AchareFeatureKey[],
): AchareModuleKey[] =>
  Object.values(ACHARE_MODULES)
    .filter((module) =>
      module.features.some((feature) => enabledFeatures.includes(feature)),
    )
    .sort((first, second) => first.position - second.position)
    .map((module) => module.key);

/**
 * Resolves the navigation menu item keys surfaced by a set of enabled features.
 * Used to filter the navigation drawer and global create menu.
 */
export const getEnabledNavigationMenuItemKeys = (
  enabledFeatures: AchareFeatureKey[],
): string[] =>
  enabledFeatures
    .map((feature) => ACHARE_FEATURES[feature]?.navigationMenuItemKey)
    .filter((navigationMenuItemKey): navigationMenuItemKey is string =>
      Boolean(navigationMenuItemKey),
    );

/**
 * Resolves the standard object keys surfaced by a set of enabled features.
 * Used to filter global search and record-page access.
 */
export const getEnabledStandardObjectKeys = (
  enabledFeatures: AchareFeatureKey[],
): string[] =>
  enabledFeatures
    .map((feature) => ACHARE_FEATURES[feature]?.standardObjectKey)
    .filter((standardObjectKey): standardObjectKey is string =>
      Boolean(standardObjectKey),
    );
