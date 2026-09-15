import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { RESTART_ACHARE_ONBOARDING } from '@/onboarding/graphql/mutations/restartAchareOnboarding';

export const useRestartAchareOnboardingMutation = () => {
  const [mutate, result] = useMutation(RESTART_ACHARE_ONBOARDING);

  const restartOnboarding = useCallback(async () => {
    return mutate();
  }, [mutate]);

  return [restartOnboarding, result] as const;
};
