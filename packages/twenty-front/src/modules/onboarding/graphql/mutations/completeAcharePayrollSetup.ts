import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_PAYROLL_SETUP = gql`
  mutation CompleteAcharePayrollSetup($input: AcharePayrollSetupInput!) {
    completeAcharePayrollSetup(input: $input) {
      success
      currentStep
    }
  }
`;
