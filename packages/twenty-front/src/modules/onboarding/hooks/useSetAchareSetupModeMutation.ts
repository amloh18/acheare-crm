import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { SetAchareSetupModeDocument } from '~/generated-metadata/graphql';

export const useSetAchareSetupModeMutation = () => {
  const [mutate, result] = useMutation(SetAchareSetupModeDocument);

  const setSetupMode = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [setSetupMode, result] as const;
};
