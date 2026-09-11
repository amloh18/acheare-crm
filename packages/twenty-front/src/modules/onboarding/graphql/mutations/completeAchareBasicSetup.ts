import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_BASIC_SETUP = gql`
  mutation CompleteAchareBasicSetup($input: AchareBasicSetupInput!) {
    completeAchareBasicSetup(input: $input) {
      success
      currentStep
    }
  }
`;
