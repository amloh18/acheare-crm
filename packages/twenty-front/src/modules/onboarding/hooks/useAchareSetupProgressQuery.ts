import { useQuery } from '@apollo/client/react';

import { GetAchareSetupProgressDocument } from '~/generated-metadata/graphql';

export const useAchareSetupProgressQuery = () => {
  return useQuery(GetAchareSetupProgressDocument);
};
