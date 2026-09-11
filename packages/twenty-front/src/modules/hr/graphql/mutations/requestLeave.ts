import { gql } from '@apollo/client';

export const REQUEST_LEAVE = gql`
  mutation RequestLeave($input: RequestLeaveInput!) {
    requestLeave(input: $input) {
      id
      employeeId
      leaveTypeId
      startDate
      endDate
      days
      reason
      status
    }
  }
`;
