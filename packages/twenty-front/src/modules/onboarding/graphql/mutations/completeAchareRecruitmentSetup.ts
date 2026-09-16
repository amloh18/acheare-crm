import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_RECRUITMENT_SETUP = gql`
  mutation CompleteAchareRecruitmentSetup(
    $input: AchareRecruitmentSetupInput!
  ) {
    completeAchareRecruitmentSetup(input: $input) {
      success
      currentStep
    }
  }
`;
