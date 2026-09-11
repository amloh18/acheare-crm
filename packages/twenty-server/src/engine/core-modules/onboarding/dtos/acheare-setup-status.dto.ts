import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AchareSetupStepStatus')
export class AchareSetupStepStatusDTO {
  @Field(() => String)
  step: string;

  @Field(() => String)
  status: string;
}

@ObjectType('AchareSetupProgress')
export class AchareSetupProgressDTO {
  @Field(() => String)
  status: string;

  @Field(() => String, { nullable: true })
  mode: string | null;

  @Field(() => String, { nullable: true })
  currentStep: string | null;

  @Field(() => [String])
  completedSteps: string[];

  @Field(() => String, { nullable: true })
  completedAt: string | null;

  @Field(() => Number, { nullable: true })
  setupVersion: number | null;

  @Field(() => [AchareSetupStepStatusDTO])
  stepStatuses: AchareSetupStepStatusDTO[];
}

@ObjectType('AchareSetupSuccess')
export class AchareSetupSuccessDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  currentStep: string | null;
}
