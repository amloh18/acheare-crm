import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_DASHBOARD_SETUP = gql`
  mutation CompleteAchareDashboardSetup($input: AchareDashboardSetupInput!) {
    completeAchareDashboardSetup(input: $input) {
      success
      currentStep
    }
  }
`;
