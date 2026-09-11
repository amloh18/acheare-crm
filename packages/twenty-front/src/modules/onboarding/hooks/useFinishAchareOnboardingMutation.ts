import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { FinishAchareOnboardingDocument } from '~/generated-metadata/graphql';

export const useFinishAchareOnboardingMutation = () => {
  const [mutate, result] = useMutation(FinishAchareOnboardingDocument);

  const finishOnboarding = useCallback(async () => {
    return mutate();
  }, [mutate]);

  return [finishOnboarding, result] as const;
};
