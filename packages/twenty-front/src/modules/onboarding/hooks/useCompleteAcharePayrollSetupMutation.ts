import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAcharePayrollSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAcharePayrollSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAcharePayrollSetupDocument);

  const completePayrollSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completePayrollSetup, result] as const;
};
