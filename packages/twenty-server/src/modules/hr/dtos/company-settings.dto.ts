import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('UpsertCompanySettingsInput')
export class UpsertCompanySettingsInputDTO {
  @Field(() => String, { nullable: true })
  companyName?: string;

  @Field(() => String, { nullable: true })
  workStartTime?: string;

  @Field(() => String, { nullable: true })
  workEndTime?: string;

  @Field(() => Number, { nullable: true })
  breakMinutes?: number;

  @Field(() => Number, { nullable: true })
  graceMinutes?: number;

  @Field(() => [String], { nullable: true })
  workingDays?: string[];

  @Field(() => Number, { nullable: true })
  lateThresholdMinutes?: number;

  @Field(() => Number, { nullable: true })
  halfDayThresholdMinutes?: number;

  @Field(() => Number, { nullable: true })
  absentThresholdMinutes?: number;

  @Field(() => String, { nullable: true })
  timingMode?: string;

  @Field(() => Number, { nullable: true })
  flexibleHoursRequired?: number;

  @Field(() => Boolean, { nullable: true })
  requireGeolocationForCheckIn?: boolean;

  @Field(() => Boolean, { nullable: true })
  allowRemoteCheckIn?: boolean;
}

@ObjectType('CompanySettings')
export class CompanySettingsDTO {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  companyName?: string;

  @Field(() => String, { nullable: true })
  workStartTime?: string;

  @Field(() => String, { nullable: true })
  workEndTime?: string;

  @Field(() => Number, { nullable: true })
  breakMinutes?: number;

  @Field(() => Number, { nullable: true })
  graceMinutes?: number;

  @Field(() => [String], { nullable: true })
  workingDays?: string[];

  @Field(() => Number, { nullable: true })
  lateThresholdMinutes?: number;

  @Field(() => Number, { nullable: true })
  halfDayThresholdMinutes?: number;

  @Field(() => Number, { nullable: true })
  absentThresholdMinutes?: number;

  @Field(() => String, { nullable: true })
  timingMode?: string;

  @Field(() => Number, { nullable: true })
  flexibleHoursRequired?: number;

  @Field(() => Boolean)
  requireGeolocationForCheckIn: boolean;

  @Field(() => Boolean)
  allowRemoteCheckIn: boolean;

  @Field(() => Boolean)
  isActive: boolean;
}
