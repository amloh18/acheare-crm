import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_FEATURE_SELECTION = gql`
  mutation CompleteAchareFeatureSelection($input: AchareFeatureSelectionInput!) {
    completeAchareFeatureSelection(input: $input) {
      success
      currentStep
    }
  }
`;
