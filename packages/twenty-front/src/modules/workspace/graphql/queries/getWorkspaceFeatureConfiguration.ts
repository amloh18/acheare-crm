import { gql } from '@apollo/client';

export const GET_WORKSPACE_FEATURE_CONFIGURATION = gql`
  query GetWorkspaceFeatureConfiguration {
    workspaceFeatureConfiguration {
      enabledFeatures
      enabledModules
      onboardingSteps
      setupVersion
      modules {
        key
        label
        description
        icon
        position
        enabled
        features {
          key
          moduleKey
          label
          description
          icon
          enabled
          standardObjectKey
          navigationMenuItemKey
        }
      }
    }
  }
`;
