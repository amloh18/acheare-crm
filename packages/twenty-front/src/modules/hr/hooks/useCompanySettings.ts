import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COMPANY_SETTINGS, UPSERT_COMPANY_SETTINGS } from '@/hr/graphql/queries/companySettings';

export const useCompanySettings = () => {
  const { data, loading, error, refetch } = useQuery(GET_COMPANY_SETTINGS) as any;

  const [upsertCompanySettings, { loading: upsertLoading }] = useMutation(
    UPSERT_COMPANY_SETTINGS,
    {
      refetchQueries: [{ query: GET_COMPANY_SETTINGS }],
    },
  );

  return {
    settings: data?.getCompanySettings,
    loading,
    error,
    refetch,
    upsertCompanySettings,
    upsertLoading,
  };
};
