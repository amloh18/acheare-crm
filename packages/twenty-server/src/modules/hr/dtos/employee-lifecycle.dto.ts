import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('ActivateEmployeeInput')
export class ActivateEmployeeInputDTO {
  @Field(() => String)
  employeeId: string;
}

@InputType('DeactivateEmployeeInput')
export class DeactivateEmployeeInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  reason: string;
}

@InputType('TransitionEmployeeStatusInput')
export class TransitionEmployeeStatusInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  newStatus: string;
}

@InputType('AssignManagerInput')
export class AssignManagerInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  managerId: string;
}

@InputType('AssignDepartmentInput')
export class AssignDepartmentInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  departmentId: string;
}

@InputType('AssignTeamInput')
export class AssignTeamInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  teamId: string;
}

@ObjectType('Employee')
export class EmployeeDTO {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  employeeCode: string | null;

  @Field(() => String, { nullable: true })
  status: string | null;

  @Field(() => String, { nullable: true })
  employmentType: string | null;

  @Field(() => String, { nullable: true })
  joiningDate: string | null;

  @Field(() => String, { nullable: true })
  exitDate: string | null;

  @Field(() => String, { nullable: true })
  personId: string | null;

  @Field(() => String, { nullable: true })
  departmentId: string | null;

  @Field(() => String, { nullable: true })
  teamId: string | null;

  @Field(() => String, { nullable: true })
  designationId: string | null;

  @Field(() => String, { nullable: true })
  locationId: string | null;

  @Field(() => String, { nullable: true })
  managerId: string | null;
}
