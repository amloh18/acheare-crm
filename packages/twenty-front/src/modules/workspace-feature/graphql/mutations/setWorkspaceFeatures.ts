import { gql } from '@apollo/client';

export const SET_WORKSPACE_FEATURES = gql`
  mutation SetWorkspaceFeatures($input: SetAchareWorkspaceFeaturesInput!) {
    setWorkspaceFeatures(input: $input) {
      success
      enabledFeatures
    }
  }
`;
