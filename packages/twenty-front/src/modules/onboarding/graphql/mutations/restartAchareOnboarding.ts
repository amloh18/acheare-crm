import { gql } from '@apollo/client';

export const RESTART_ACHARE_ONBOARDING = gql`
  mutation RestartAchareOnboarding {
    restartAchareOnboarding {
      success
      currentStep
    }
  }
`;
