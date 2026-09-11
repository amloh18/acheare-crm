import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { AchareFeatureKey, AchareModuleKey } from 'twenty-shared/workspace';

registerEnumType(AchareFeatureKey, {
  name: 'AchareFeatureKey',
});

registerEnumType(AchareModuleKey, {
  name: 'AchareModuleKey',
});

@ObjectType('AchareFeature')
export class AchareFeatureDTO {
  @Field(() => AchareFeatureKey)
  key: AchareFeatureKey;

  @Field(() => AchareModuleKey)
  moduleKey: AchareModuleKey;

  @Field(() => String)
  label: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  icon: string;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => String, { nullable: true })
  standardObjectKey: string | null;

  @Field(() => String, { nullable: true })
  navigationMenuItemKey: string | null;
}

@ObjectType('AchareModule')
export class AchareModuleDTO {
  @Field(() => AchareModuleKey)
  key: AchareModuleKey;

  @Field(() => String)
  label: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  icon: string;

  @Field(() => Int)
  position: number;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => [AchareFeatureDTO])
  features: AchareFeatureDTO[];
}

@ObjectType('AchareWorkspaceFeatureConfiguration')
export class AchareWorkspaceFeatureConfigurationDTO {
  @Field(() => [AchareFeatureKey])
  enabledFeatures: AchareFeatureKey[];

  @Field(() => [AchareModuleKey])
  enabledModules: AchareModuleKey[];

  @Field(() => [String])
  onboardingSteps: string[];

  @Field(() => Int)
  setupVersion: number;

  @Field(() => [AchareModuleDTO])
  modules: AchareModuleDTO[];
}

@ObjectType('AchareWorkspaceFeatureMutationSuccess')
export class AchareWorkspaceFeatureMutationSuccessDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => [AchareFeatureKey])
  enabledFeatures: AchareFeatureKey[];
}

@InputType('SetAchareWorkspaceFeaturesInput')
export class SetAchareWorkspaceFeaturesInput {
  @Field(() => [AchareFeatureKey])
  features: AchareFeatureKey[];
}

@InputType('DisableAchareWorkspaceFeatureInput')
export class DisableAchareWorkspaceFeatureInput {
  @Field(() => AchareFeatureKey)
  feature: AchareFeatureKey;

  @Field(() => Boolean, { nullable: true })
  cascade?: boolean;
}
