import { gql } from '@apollo/client';

export const GET_LOCATIONS = gql`
  query GetLocations {
    getLocations {
      id
      name
      address
      city
      state
      country
      timezone
      latitude
      longitude
      geofenceRadiusMeters
      isActive
    }
  }
`;

export const CREATE_LOCATION = gql`
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
      name
      address
      city
      state
      country
      timezone
      latitude
      longitude
      geofenceRadiusMeters
      isActive
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($locationId: String!, $input: UpdateLocationInput!) {
    updateLocation(locationId: $locationId, input: $input) {
      id
      name
      address
      city
      state
      country
      timezone
      latitude
      longitude
      geofenceRadiusMeters
      isActive
    }
  }
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($locationId: String!) {
    deleteLocation(locationId: $locationId)
  }
`;

export const GET_PENDING_REMOTE_CHECK_INS = gql`
  query GetPendingRemoteCheckIns {
    pendingRemoteCheckIns {
      id
      employeeId
      eventType
      timestamp
      source
      latitude
      longitude
      locationName
      isRemote
      approvalStatus
    }
  }
`;

export const APPROVE_REMOTE_CHECK_IN = gql`
  mutation ApproveRemoteCheckIn($input: ApproveRemoteCheckInInput!) {
    approveRemoteCheckIn(input: $input) {
      id
      employeeId
      eventType
      timestamp
      source
      latitude
      longitude
      locationName
      isRemote
      approvalStatus
    }
  }
`;
