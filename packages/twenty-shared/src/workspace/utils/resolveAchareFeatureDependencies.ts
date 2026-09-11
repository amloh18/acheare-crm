import { ACHARE_FEATURE_DEFINITIONS } from '../constants/AchareFeatures';
import { ACHARE_FEATURE_DEPENDENCIES } from '../constants/AchareFeatureDependencies';
import { type AchareFeatureKey } from '../types/AchareFeatureKey';

/**
 * Expands a set of selected features into the full set that must be enabled,
 * following the dependency graph transitively.
 *
 * The result is returned in catalogue order so callers produce stable,
 * deterministic output (important for idempotent writes and diffs).
 */
export const resolveAchareFeatureDependencies = (
  selectedFeatures: AchareFeatureKey[],
): AchareFeatureKey[] => {
  const resolved = new Set<AchareFeatureKey>();
  const queue: AchareFeatureKey[] = [...selectedFeatures];

  while (queue.length > 0) {
    const feature = queue.shift();

    if (feature === undefined || resolved.has(feature)) {
      continue;
    }

    resolved.add(feature);

    for (const dependency of ACHARE_FEATURE_DEPENDENCIES[feature] ?? []) {
      if (!resolved.has(dependency)) {
        queue.push(dependency);
      }
    }
  }

  return ACHARE_FEATURE_DEFINITIONS.map((definition) => definition.key).filter(
    (featureKey) => resolved.has(featureKey),
  );
};

/**
 * Returns the features that would be auto-enabled on top of the given
 * selection because of dependency rules. Used to tell the user
 * "Payroll requires Employees and Salary — these will also be enabled."
 */
export const getMissingAchareFeatureDependencies = (
  selectedFeatures: AchareFeatureKey[],
): AchareFeatureKey[] => {
  const selected = new Set(selectedFeatures);

  return resolveAchareFeatureDependencies(selectedFeatures).filter(
    (featureKey) => !selected.has(featureKey),
  );
};

/**
 * Returns the enabled features that directly or transitively depend on the
 * given feature — i.e. what would be orphaned if it were disabled.
 */
export const getAchareDependentFeatures = (
  feature: AchareFeatureKey,
  enabledFeatures: AchareFeatureKey[],
): AchareFeatureKey[] => {
  const enabled = new Set(enabledFeatures);

  return enabledFeatures.filter(
    (candidate) =>
      candidate !== feature &&
      resolveAchareFeatureDependencies([candidate]).includes(feature) &&
      enabled.has(candidate),
  );
};
