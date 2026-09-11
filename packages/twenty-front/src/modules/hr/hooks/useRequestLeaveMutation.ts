import { useMutation } from '@apollo/client/react';

import { REQUEST_LEAVE } from '@/hr/graphql/mutations/requestLeave';

export const useRequestLeaveMutation = () => {
  return useMutation(REQUEST_LEAVE) as any;
};
