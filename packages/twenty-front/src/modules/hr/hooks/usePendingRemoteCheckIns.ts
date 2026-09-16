import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_PENDING_REMOTE_CHECK_INS,
  APPROVE_REMOTE_CHECK_IN,
} from '@/hr/graphql/queries/locations';

export const usePendingRemoteCheckIns = () => {
  const { data, loading, error, refetch } = useQuery(
    GET_PENDING_REMOTE_CHECK_INS,
  ) as any;

  const [approveRemoteCheckIn] = useMutation(APPROVE_REMOTE_CHECK_IN, {
    refetchQueries: [{ query: GET_PENDING_REMOTE_CHECK_INS }],
  });

  return {
    pendingCheckIns: data?.pendingRemoteCheckIns || [],
    loading,
    error,
    refetch,
    approveRemoteCheckIn,
  };
};
