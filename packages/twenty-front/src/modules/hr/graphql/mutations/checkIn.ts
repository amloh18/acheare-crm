import { gql } from '@apollo/client';

export const CHECK_IN = gql`
  mutation CheckIn($input: CheckInInput!) {
    checkIn(input: $input) {
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
