import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('CheckInInput')
export class CheckInInputDTO {
  @Field(() => String, { nullable: true })
  employeeId?: string;

  @Field(() => String, { nullable: true })
  timestamp?: string;
}

@InputType('CheckOutInput')
export class CheckOutInputDTO {
  @Field(() => String, { nullable: true })
  employeeId?: string;

  @Field(() => String, { nullable: true })
  timestamp?: string;
}

@InputType('RequestAttendanceCorrectionInput')
export class RequestAttendanceCorrectionInputDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  workDate: string;

  @Field(() => String)
  requestedCheckIn: string;

  @Field(() => String)
  requestedCheckOut: string;

  @Field(() => String)
  reason: string;
}

@InputType('ReviewAttendanceCorrectionInput')
export class ReviewAttendanceCorrectionInputDTO {
  @Field(() => String)
  correctionId: string;

  @Field(() => Boolean)
  approved: boolean;

  @Field(() => String, { nullable: true })
  reviewNotes?: string;
}

@ObjectType('AttendanceEvent')
export class AttendanceEventDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  eventType: string;

  @Field(() => String, { nullable: true })
  timestamp: string | null;

  @Field(() => String)
  source: string;
}

@ObjectType('AttendanceCorrection')
export class AttendanceCorrectionDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  workDate: string;

  @Field(() => String)
  status: string;

  @Field(() => String, { nullable: true })
  reason: string | null;

  @Field(() => String, { nullable: true })
  reviewedAt: string | null;
}

@ObjectType('AttendanceSummary')
export class AttendanceSummaryDTO {
  @Field(() => Number)
  present: number;

  @Field(() => Number)
  absent: number;

  @Field(() => Number)
  late: number;

  @Field(() => Number)
  halfDay: number;

  @Field(() => Number)
  leave: number;

  @Field(() => Number)
  holidays: number;

  @Field(() => Number)
  totalWorkedMinutes: number;

  @Field(() => Number)
  totalOvertimeMinutes: number;
}

@ObjectType('AttendanceOperationSuccess')
export class AttendanceOperationSuccessDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message: string | null;
}
