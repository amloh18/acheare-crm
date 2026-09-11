import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_CRM_IMPORT = gql`
  mutation CompleteAchareCrmImport($input: AchareCrmImportInput!) {
    completeAchareCrmImport(input: $input) {
      success
      currentStep
    }
  }
`;
