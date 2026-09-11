import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('MyWorkspaceStats')
export class MyWorkspaceStatsDTO {
  @Field(() => Number)
  pendingTasks: number;

  @Field(() => Number)
  unreadNotifications: number;

  @Field(() => Number)
  upcomingLeave: number;
}

@ObjectType('MyWorkspaceData')
export class MyWorkspaceDataDTO {
  @Field(() => Boolean)
  hasEmployeeRecord: boolean;

  @Field(() => String, { nullable: true })
  employeeId: string | null;

  @Field(() => String, { nullable: true })
  attendanceStatus: string | null;

  @Field(() => String, { nullable: true })
  firstCheckIn: string | null;

  @Field(() => String, { nullable: true })
  lastCheckOut: string | null;

  @Field(() => Number, { nullable: true })
  workedMinutes: number | null;

  @Field(() => Number)
  pendingLeaveRequests: number;

  @Field(() => Number)
  leaveBalanceDays: number;

  @Field(() => Number)
  recentPayslipCount: number;

  @Field(() => Number)
  announcementCount: number;

  @Field(() => MyWorkspaceStatsDTO)
  stats: MyWorkspaceStatsDTO;
}
