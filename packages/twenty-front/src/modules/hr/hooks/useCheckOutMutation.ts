import { useMutation } from '@apollo/client/react';

import { CHECK_OUT } from '@/hr/graphql/mutations/checkOut';

export const useCheckOutMutation = () => {
  return useMutation(CHECK_OUT) as any;
};
