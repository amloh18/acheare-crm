import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareFinanceSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareFinanceSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareFinanceSetupDocument);

  const completeFinanceSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeFinanceSetup, result] as const;
};
