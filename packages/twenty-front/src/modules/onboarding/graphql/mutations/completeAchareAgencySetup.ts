import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_AGENCY_SETUP = gql`
  mutation CompleteAchareAgencySetup($input: AchareAgencySetupInput!) {
    completeAchareAgencySetup(input: $input) {
      success
      currentStep
    }
  }
`;
