import { ACHARE_FEATURE_DEFINITIONS } from '../constants/AchareFeatures';
import { isAchareStandardObjectEnabled } from './getAchareFeatureForStandardObject';

/**
 * The standard object keys that are gated by a feature which is *not* enabled.
 *
 * Returns `undefined` when no feature configuration is loaded — the caller
 * then filters nothing. That distinction matters: an unconfigured workspace
 * (or a non-Achare workspace) must keep every object visible, whereas a
 * configured workspace with features turned off must hide exactly those
 * objects.
 */
export const getDisabledAchareStandardObjectKeys = (
  enabledFeatures: readonly string[] | undefined,
): string[] | undefined => {
  if (enabledFeatures === undefined) {
    return undefined;
  }

  return ACHARE_FEATURE_DEFINITIONS.flatMap((definition) => {
    if (definition.standardObjectKey === undefined) {
      return [];
    }

    return enabledFeatures.includes(definition.key)
      ? []
      : [definition.standardObjectKey];
  });
};

/**
 * Whether a dashboard — or any container of widgets — is worth rendering,
 * given the standard object keys its widgets point at.
 *
 * A container with no object-backed widgets (an empty or user-authored
 * dashboard) is always visible. A container is hidden only when *every*
 * object-backed widget it holds is gated by a disabled feature, i.e. when
 * there is nothing left to show. A partially-gated container stays visible
 * with its enabled widgets only — disabling a feature hides, never deletes.
 *
 * Kept in the shared catalogue so the server (dashboard provisioning) and the
 * frontend (widget rendering) agree on one rule.
 */
export const isAchareDashboardEnabled = ({
  widgetStandardObjectKeys,
  enabledFeatures,
}: {
  widgetStandardObjectKeys: readonly (string | null | undefined)[];
  enabledFeatures: readonly string[] | undefined;
}): boolean => {
  if (enabledFeatures === undefined) {
    return true;
  }

  const objectBackedWidgetKeys = widgetStandardObjectKeys.filter(
    (standardObjectKey): standardObjectKey is string =>
      Boolean(standardObjectKey),
  );

  if (objectBackedWidgetKeys.length === 0) {
    return true;
  }

  return objectBackedWidgetKeys.some((standardObjectKey) =>
    isAchareStandardObjectEnabled(standardObjectKey, enabledFeatures),
  );
};
