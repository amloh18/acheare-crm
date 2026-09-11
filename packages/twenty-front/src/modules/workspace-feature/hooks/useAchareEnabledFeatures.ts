import { useQuery } from '@apollo/client/react';

import { GetWorkspaceFeatureConfigurationDocument } from '~/generated-metadata/graphql';

/**
 * The workspace's enabled Achare features.
 *
 * Returns `undefined` while the configuration is loading. Callers must treat
 * `undefined` as "not known yet" and skip filtering, so navigation is never
 * briefly emptied while the query is in flight.
 */
export const useAchareEnabledFeatures = (): string[] | undefined => {
  const { data } = useQuery(GetWorkspaceFeatureConfigurationDocument);

  return data?.workspaceFeatureConfiguration.enabledFeatures;
};
