import { InputType, Field } from '@nestjs/graphql';

@InputType('AchareBasicSetupInput')
export class AchareBasicSetupInputDTO {
  @Field(() => String, { nullable: true })
  agencyName?: string;

  @Field(() => String, { nullable: true })
  logoUrl?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  timezone?: string;

  @Field(() => String, { nullable: true })
  currency?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  phone?: string;
}

@InputType('AchareAgencySetupInput')
export class AchareAgencySetupInputDTO {
  @Field(() => [String], { nullable: true })
  workingDays?: string[];

  @Field(() => String, { nullable: true })
  workingDaysStart?: string;

  @Field(() => String, { nullable: true })
  workingDaysEnd?: string;

  @Field(() => [String], { nullable: true })
  departments?: string[];
}

@InputType('AchareTeamMemberInput')
export class AchareTeamMemberInputDTO {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  role: string;
}

@InputType('AchareTeamSetupInput')
export class AchareTeamSetupInputDTO {
  @Field(() => [AchareTeamMemberInputDTO], { nullable: true })
  members?: AchareTeamMemberInputDTO[];
}

@InputType('AchareCrmImportInput')
export class AchareCrmImportInputDTO {
  @Field(() => Boolean, { nullable: true })
  hasData?: boolean;

  @Field(() => Boolean, { nullable: true })
  skipImport?: boolean;
}

@InputType('AchareRecruitmentSetupInput')
export class AchareRecruitmentSetupInputDTO {
  @Field(() => [String], { nullable: true })
  candidateSources?: string[];

  @Field(() => [String], { nullable: true })
  pipelineStages?: string[];

  @Field(() => Boolean, { nullable: true })
  skipSetup?: boolean;
}

@InputType('AchareShiftInput')
export class AchareShiftInputDTO {
  @Field(() => String)
  name: string;

  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;

  @Field(() => Number, { nullable: true })
  breakMinutes?: number;

  @Field(() => Number, { nullable: true })
  graceMinutes?: number;

  @Field(() => [String], { nullable: true })
  workingDays?: string[];
}

@InputType('AchareLeaveTypeInput')
export class AchareLeaveTypeInputDTO {
  @Field(() => String)
  name: string;

  @Field(() => Number, { nullable: true })
  daysPerYear?: number;
}

@InputType('AchareHrSetupInput')
export class AchareHrSetupInputDTO {
  @Field(() => [String], { nullable: true })
  departments?: string[];

  @Field(() => [String], { nullable: true })
  designations?: string[];

  @Field(() => [AchareLeaveTypeInputDTO], { nullable: true })
  leaveTypes?: AchareLeaveTypeInputDTO[];

  @Field(() => [AchareShiftInputDTO], { nullable: true })
  shifts?: AchareShiftInputDTO[];

  @Field(() => Boolean, { nullable: true })
  skipSetup?: boolean;
}

@InputType('AchareSalaryComponentInput')
export class AchareSalaryComponentInputDTO {
  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  calculation?: string;

  @Field(() => Number, { nullable: true })
  amount?: number;

  @Field(() => Number, { nullable: true })
  percentage?: number;

  @Field(() => Boolean, { nullable: true })
  taxable?: boolean;
}

@InputType('AcharePayrollSetupInput')
export class AcharePayrollSetupInputDTO {
  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  currency?: string;

  @Field(() => String, { nullable: true })
  payrollCycle?: string;

  @Field(() => String, { nullable: true })
  payPeriod?: string;

  @Field(() => String, { nullable: true })
  prorationMethod?: string;

  @Field(() => String, { nullable: true })
  defaultPayDate?: string;

  @Field(() => Boolean, { nullable: true })
  overtimeEnabled?: boolean;

  @Field(() => Number, { nullable: true })
  overtimeMultiplier?: number;

  @Field(() => [AchareSalaryComponentInputDTO], { nullable: true })
  salaryComponents?: AchareSalaryComponentInputDTO[];

  @Field(() => Boolean, { nullable: true })
  skipSetup?: boolean;
}

@InputType('AchareDashboardSetupInput')
export class AchareDashboardSetupInputDTO {
  @Field(() => Boolean, { nullable: true })
  provisionDefaults?: boolean;

  @Field(() => [String], { nullable: true })
  dashboardTypes?: string[];
}
