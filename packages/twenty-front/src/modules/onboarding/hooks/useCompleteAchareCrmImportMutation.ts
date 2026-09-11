import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareCrmImportDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareCrmImportMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareCrmImportDocument);

  const completeCrmImport = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeCrmImport, result] as const;
};
