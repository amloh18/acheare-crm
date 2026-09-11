import { gql } from '@apollo/client';

export const COMPLETE_ACHARE_TEAM_SETUP = gql`
  mutation CompleteAchareTeamSetup($input: AchareTeamSetupInput!) {
    completeAchareTeamSetup(input: $input) {
      success
      currentStep
    }
  }
`;
