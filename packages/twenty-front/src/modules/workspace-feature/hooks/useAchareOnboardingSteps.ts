import { useQuery } from '@apollo/client/react';
import { type AchareOnboardingStepKey } from 'twenty-shared/workspace';

import { GetWorkspaceFeatureConfigurationDocument } from '~/generated-metadata/graphql';

/**
 * The onboarding steps this workspace will actually see, generated server-side
 * from its enabled features.
 *
 * Returns `undefined` while the configuration is loading. Callers must treat
 * `undefined` as "unknown yet" and fall back to the full canonical order rather
 * than assuming the wizard is empty.
 */
export const useAchareOnboardingSteps = ():
  | AchareOnboardingStepKey[]
  | undefined => {
  const { data } = useQuery(GetWorkspaceFeatureConfigurationDocument);

  return data?.workspaceFeatureConfiguration.onboardingSteps as
    | AchareOnboardingStepKey[]
    | undefined;
};
