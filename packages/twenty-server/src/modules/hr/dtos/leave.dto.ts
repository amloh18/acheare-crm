import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('RequestLeaveInput')
export class RequestLeaveInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  leaveTypeId: string;

  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field(() => String)
  reason: string;
}

@InputType('ReviewLeaveInput')
export class ReviewLeaveInputDTO {
  @Field(() => String)
  leaveRequestId: string;

  @Field(() => Boolean)
  approved: boolean;

  @Field(() => String, { nullable: true })
  reviewNotes?: string;
}

@InputType('CancelLeaveInput')
export class CancelLeaveInputDTO {
  @Field(() => String)
  leaveRequestId: string;

  @Field(() => String)
  employeeId: string;
}

@ObjectType('LeaveRequest')
export class LeaveRequestDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  leaveTypeId: string;

  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field(() => Number)
  days: number;

  @Field(() => String)
  reason: string;

  @Field(() => String)
  status: string;

  @Field(() => String, { nullable: true })
  reviewedAt: string | null;

  @Field(() => String, { nullable: true })
  reviewedById: string | null;

  @Field(() => String, { nullable: true })
  reviewNotes: string | null;
}

@ObjectType('LeaveBalance')
export class LeaveBalanceDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  leaveTypeId: string;

  @Field(() => Number)
  year: number;

  @Field(() => Number)
  entitled: number;

  @Field(() => Number)
  used: number;

  @Field(() => Number)
  pending: number;
}
