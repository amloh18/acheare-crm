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

@ObjectType('MyWorkspaceLeaveRequest')
export class MyWorkspaceLeaveRequestDTO {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  leaveTypeId: string | null;

  @Field(() => String, { nullable: true })
  startDate: string | null;

  @Field(() => String, { nullable: true })
  endDate: string | null;

  @Field(() => Number, { nullable: true })
  days: number | null;

  @Field(() => String, { nullable: true })
  status: string | null;

  @Field(() => String, { nullable: true })
  reason: string | null;
}

@ObjectType('MyWorkspaceLeaveBalance')
export class MyWorkspaceLeaveBalanceDTO {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  leaveTypeId: string | null;

  @Field(() => Number, { nullable: true })
  year: number | null;

  @Field(() => Number)
  entitled: number;

  @Field(() => Number)
  used: number;

  @Field(() => Number)
  pending: number;

  @Field(() => Number)
  available: number;
}

@ObjectType('MyWorkspacePayslip')
export class MyWorkspacePayslipDTO {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  payrollPeriodId: string | null;

  @Field(() => Number, { nullable: true })
  netPayAmountMicros: number | null;

  @Field(() => String, { nullable: true })
  currencyCode: string | null;

  @Field(() => String, { nullable: true })
  paymentStatus: string | null;

  @Field(() => String, { nullable: true })
  paidAt: string | null;
}

@ObjectType('MyWorkspaceAnnouncement')
export class MyWorkspaceAnnouncementDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  body: string | null;

  @Field(() => String, { nullable: true })
  publishAt: string | null;
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

  @Field(() => [MyWorkspaceLeaveRequestDTO])
  pendingLeaveRequestList: MyWorkspaceLeaveRequestDTO[];

  @Field(() => [MyWorkspaceLeaveBalanceDTO])
  leaveBalanceList: MyWorkspaceLeaveBalanceDTO[];

  @Field(() => [MyWorkspacePayslipDTO])
  recentPayslipList: MyWorkspacePayslipDTO[];

  @Field(() => [MyWorkspaceAnnouncementDTO])
  announcementList: MyWorkspaceAnnouncementDTO[];

  @Field(() => MyWorkspaceStatsDTO)
  stats: MyWorkspaceStatsDTO;
}
