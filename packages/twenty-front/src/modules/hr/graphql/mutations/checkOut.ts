import { gql } from '@apollo/client';

export const CHECK_OUT = gql`
  mutation CheckOut($input: CheckOutInput!) {
    checkOut(input: $input) {
      id
      employeeId
      eventType
      timestamp
      source
    }
  }
`;
