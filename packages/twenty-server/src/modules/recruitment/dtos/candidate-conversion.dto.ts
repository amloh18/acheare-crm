import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('ConvertCandidateToEmployeeInput')
export class ConvertCandidateToEmployeeInputDTO {
  @Field(() => String)
  candidateId: string;

  @Field(() => String)
  submissionId: string;

  @Field(() => String, { nullable: true })
  departmentId?: string;

  @Field(() => String, { nullable: true })
  teamId?: string;

  @Field(() => String, { nullable: true })
  designationId?: string;

  @Field(() => String, { nullable: true })
  locationId?: string;

  @Field(() => String, { nullable: true })
  managerId?: string;

  @Field(() => String, { nullable: true })
  joiningDate?: string;

  @Field(() => String, { nullable: true })
  employeeCode?: string;
}

@ObjectType('ConversionResult')
export class ConversionResultDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  candidateId: string;

  @Field(() => Number)
  onboardingItemsCreated: number;
}

@ObjectType('ConversionHistoryEntry')
export class ConversionHistoryEntryDTO {
  @Field(() => String)
  candidateId: string;

  @Field(() => String)
  candidateName: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  convertedAt: string;
}
