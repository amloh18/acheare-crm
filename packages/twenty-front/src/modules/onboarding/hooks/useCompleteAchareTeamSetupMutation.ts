import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareTeamSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareTeamSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareTeamSetupDocument);

  const completeTeamSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeTeamSetup, result] as const;
};
