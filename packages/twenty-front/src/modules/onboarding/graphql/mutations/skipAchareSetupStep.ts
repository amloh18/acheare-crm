import { gql } from '@apollo/client';

export const SKIP_ACHARE_SETUP_STEP = gql`
  mutation SkipAchareSetupStep($step: String!) {
    skipAchareSetupStep(step: $step) {
      success
      currentStep
    }
  }
`;
