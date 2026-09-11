import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_FINANCE_SETUP = gql`
  mutation CompleteAchareFinanceSetup($input: AchareModuleSetupInput!) {
    completeAchareFinanceSetup(input: $input) {
      success
      currentStep
    }
  }
`;
