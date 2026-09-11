import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareDocumentsSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareDocumentsSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareDocumentsSetupDocument);

  const completeDocumentsSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeDocumentsSetup, result] as const;
};
