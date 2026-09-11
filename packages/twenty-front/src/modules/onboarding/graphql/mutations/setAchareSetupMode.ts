import { gql } from '@apollo/client';

export const SET_ACHARE_SETUP_MODE = gql`
  mutation SetAchareSetupMode($mode: String!) {
    setAchareSetupMode(mode: $mode) {
      success
      currentStep
    }
  }
`;
