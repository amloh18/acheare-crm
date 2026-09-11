import { gql } from '@apollo/client';

export const START_ACHARE_ONBOARDING = gql`
  mutation StartAchareOnboarding {
    startAchareOnboarding {
      success
      currentStep
    }
  }
`;
