import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_HR_SETUP = gql`
  mutation CompleteAchareHrSetup($input: AchareHrSetupInput!) {
    completeAchareHrSetup(input: $input) {
      success
      currentStep
    }
  }
`;
