import { useQuery } from '@apollo/client/react';

import { GET_MY_WORKSPACE_DATA } from '@/hr/graphql/queries/getMyWorkspaceData';

export const useMyWorkspaceData = () => {
  return useQuery(GET_MY_WORKSPACE_DATA) as any;
};
