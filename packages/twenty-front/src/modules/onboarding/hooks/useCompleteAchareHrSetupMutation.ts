import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareHrSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareHrSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareHrSetupDocument);

  const completeHrSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeHrSetup, result] as const;
};
