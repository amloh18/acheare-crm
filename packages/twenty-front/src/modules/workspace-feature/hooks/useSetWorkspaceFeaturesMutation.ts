import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { SetWorkspaceFeaturesDocument } from '~/generated-metadata/graphql';

/**
 * Replaces the workspace's enabled feature set.
 *
 * Dependencies are resolved server-side, so requesting Payroll also enables
 * Employees and Salary. That also means a selection that omits a feature still
 * required by another enabled feature will have it re-added — callers must
 * resolve dependents first (see `getAchareDependentFeatures`).
 */
export const useSetWorkspaceFeaturesMutation = () => {
  const [mutate, result] = useMutation(SetWorkspaceFeaturesDocument);

  const setWorkspaceFeatures = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [setWorkspaceFeatures, result] as const;
};
