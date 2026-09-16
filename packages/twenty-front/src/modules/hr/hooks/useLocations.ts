import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_LOCATIONS,
  CREATE_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
} from '@/hr/graphql/queries/locations';

export const useLocations = () => {
  const { data, loading, error, refetch } = useQuery(GET_LOCATIONS) as any;

  const [createLocation] = useMutation(CREATE_LOCATION, {
    refetchQueries: [{ query: GET_LOCATIONS }],
  });

  const [updateLocation] = useMutation(UPDATE_LOCATION, {
    refetchQueries: [{ query: GET_LOCATIONS }],
  });

  const [deleteLocation] = useMutation(DELETE_LOCATION, {
    refetchQueries: [{ query: GET_LOCATIONS }],
  });

  return {
    locations: data?.getLocations || [],
    loading,
    error,
    refetch,
    createLocation,
    updateLocation,
    deleteLocation,
  };
};
