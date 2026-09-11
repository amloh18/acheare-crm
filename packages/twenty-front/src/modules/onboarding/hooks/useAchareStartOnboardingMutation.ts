import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { StartAchareOnboardingDocument } from '~/generated-metadata/graphql';

export const useAchareStartOnboardingMutation = () => {
  const [mutate, result] = useMutation(StartAchareOnboardingDocument);

  const startOnboarding = useCallback(async () => {
    return mutate();
  }, [mutate]);

  return [startOnboarding, result] as const;
};
