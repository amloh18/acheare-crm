import { gql } from '@apollo/client';

export const FINISH_ACHARE_ONBOARDING = gql`
  mutation FinishAchareOnboarding {
    finishAchareOnboarding {
      success
      currentStep
    }
  }
`;
