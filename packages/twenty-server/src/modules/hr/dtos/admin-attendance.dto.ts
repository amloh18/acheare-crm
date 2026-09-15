import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('AllEmployeesAttendanceInput')
export class AllEmployeesAttendanceInputDTO {
  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field(() => String, { nullable: true })
  departmentId?: string;

  @Field(() => String, { nullable: true })
  status?: string;
}

@ObjectType('EmployeeAttendanceDay')
export class EmployeeAttendanceDayDTO {
  @Field(() => Number)
  day: number;

  @Field(() => String, { nullable: true })
  status: string | null;

  @Field(() => String, { nullable: true })
  hours: string | null;

  @Field(() => Number, { nullable: true })
  workedMinutes: number | null;

  @Field(() => Number, { nullable: true })
  lateMinutes: number | null;
}

@ObjectType('EmployeeAttendanceRow')
export class EmployeeAttendanceRowDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  role: string | null;

  @Field(() => String, { nullable: true })
  initials: string | null;

  @Field(() => String, { nullable: true })
  departmentId: string | null;

  @Field(() => String, { nullable: true })
  departmentName: string | null;

  @Field(() => [EmployeeAttendanceDayDTO])
  days: EmployeeAttendanceDayDTO[];
}

@ObjectType('AllEmployeesAttendanceSummary')
export class AllEmployeesAttendanceSummaryDTO {
  @Field(() => Number)
  presentToday: number;

  @Field(() => Number)
  lateEntry: number;

  @Field(() => Number)
  onLeave: number;

  @Field(() => Number)
  absent: number;

  @Field(() => Number)
  totalEmployees: number;

  @Field(() => [EmployeeAttendanceRowDTO])
  employees: EmployeeAttendanceRowDTO[];
}

@InputType('AllLeaveRequestsInput')
export class AllLeaveRequestsInputDTO {
  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  employeeId?: string;

  @Field(() => String, { nullable: true })
  leaveTypeId?: string;
}

@ObjectType('LeaveRequestWithEmployee')
export class LeaveRequestWithEmployeeDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String, { nullable: true })
  employeeName: string | null;

  @Field(() => String, { nullable: true })
  leaveTypeId: string | null;

  @Field(() => String, { nullable: true })
  leaveTypeName: string | null;

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
  reviewNotes: string | null;
}

@ObjectType('LeaveType')
export class LeaveTypeDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  isPaid: boolean;

  @Field(() => Number)
  annualQuota: number;

  @Field(() => Boolean)
  isActive: boolean;
}

@ObjectType('AllLeaveRequestsResult')
export class AllLeaveRequestsResultDTO {
  @Field(() => [LeaveRequestWithEmployeeDTO])
  requests: LeaveRequestWithEmployeeDTO[];

  @Field(() => Number)
  totalCount: number;

  @Field(() => Number)
  pendingCount: number;

  @Field(() => Number)
  approvedCount: number;

  @Field(() => Number)
  rejectedCount: number;
}
