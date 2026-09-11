import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareDashboardSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareDashboardSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareDashboardSetupDocument);

  const completeDashboardSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeDashboardSetup, result] as const;
};
