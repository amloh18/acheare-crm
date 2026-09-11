import { useMutation } from '@apollo/client/react';

import { CHECK_IN } from '@/hr/graphql/mutations/checkIn';

export const useCheckInMutation = () => {
  return useMutation(CHECK_IN) as any;
};
