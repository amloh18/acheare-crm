import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareBasicSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareBasicSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareBasicSetupDocument);

  const completeBasicSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeBasicSetup, result] as const;
};
