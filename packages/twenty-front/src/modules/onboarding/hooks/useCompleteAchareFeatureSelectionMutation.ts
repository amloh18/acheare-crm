import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareFeatureSelectionDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareFeatureSelectionMutation = () => {
  const [mutate, result] = useMutation(
    CompleteAchareFeatureSelectionDocument,
  );

  const completeFeatureSelection = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeFeatureSelection, result] as const;
};
