import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_DOCUMENTS_SETUP = gql`
  mutation CompleteAchareDocumentsSetup($input: AchareModuleSetupInput!) {
    completeAchareDocumentsSetup(input: $input) {
      success
      currentStep
    }
  }
`;
