import { gql } from '@apollo/client';

export const GET_ACHARE_SETUP_PROGRESS = gql`
  query GetAchareSetupProgress {
    acheareSetupProgress {
      status
      mode
      currentStep
      completedSteps
      completedAt
      setupVersion
      stepStatuses {
        step
        status
      }
    }
  }
`;
