import {
  ACHARE_MODULE_ONBOARDING_STEP,
  ACHARE_MODULE_ONBOARDING_STEP_ORDER,
  ACHARE_ONBOARDING_LEADING_STEPS,
  ACHARE_ONBOARDING_TRAILING_STEPS,
  type AchareOnboardingStepKey,
} from '../constants/AchareOnboardingSteps';
import { type AchareFeatureKey } from '../types/AchareFeatureKey';
import { isAchareModuleEnabled } from './isAchareFeatureEnabled';

/**
 * Generates the Achare onboarding steps for a workspace from its enabled
 * features.
 *
 * This is the single place that decides which onboarding steps a workspace
 * sees. Modules with no enabled feature contribute no step, so the wizard
 * adapts to the feature selection instead of forcing every step on every user.
 */
export const getAchareOnboardingSteps = (
  enabledFeatures: AchareFeatureKey[],
): AchareOnboardingStepKey[] => {
  const moduleSteps = ACHARE_MODULE_ONBOARDING_STEP_ORDER.filter((moduleKey) =>
    isAchareModuleEnabled(enabledFeatures, moduleKey),
  )
    .map((moduleKey) => ACHARE_MODULE_ONBOARDING_STEP[moduleKey])
    .filter((step): step is AchareOnboardingStepKey => step !== undefined);

  return [
    ...ACHARE_ONBOARDING_LEADING_STEPS,
    ...moduleSteps,
    ...ACHARE_ONBOARDING_TRAILING_STEPS,
  ];
};
