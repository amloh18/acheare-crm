import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareAgencySetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareAgencySetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareAgencySetupDocument);

  const completeAgencySetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeAgencySetup, result] as const;
};
