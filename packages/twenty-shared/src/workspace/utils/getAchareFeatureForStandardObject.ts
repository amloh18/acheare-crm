import { ACHARE_FEATURE_DEFINITIONS } from '../constants/AchareFeatures';
import { type AchareFeatureKey } from '../types/AchareFeatureKey';

/**
 * Resolves the Achare feature that gates a standard object, by its
 * `STANDARD_OBJECTS` key (e.g. `company`, `employee`, `payslip`).
 *
 * Returns `undefined` for objects that are not gated by any Achare feature —
 * callers must treat those as always visible.
 */
export const getAchareFeatureForStandardObject = (
  standardObjectKey: string,
): AchareFeatureKey | undefined =>
  ACHARE_FEATURE_DEFINITIONS.find(
    (definition) => definition.standardObjectKey === standardObjectKey,
  )?.key;

/**
 * Whether a standard object should be visible for a set of enabled features.
 *
 * Ungated objects (no matching feature) are always visible. Gated objects are
 * visible only when their feature is enabled.
 */
export const isAchareStandardObjectEnabled = (
  standardObjectKey: string,
  enabledFeatures: readonly string[],
): boolean => {
  const gatingFeature = getAchareFeatureForStandardObject(standardObjectKey);

  if (gatingFeature === undefined) {
    return true;
  }

  return enabledFeatures.includes(gatingFeature);
};
