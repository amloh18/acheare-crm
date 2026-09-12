import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { MyWorkspaceService } from 'src/modules/hr/services/my-workspace.service';
import { MyWorkspaceDataDTO } from 'src/modules/hr/dtos/my-workspace.dto';

const toIsoStringOrNull = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const date = new Date(value as string | number | Date);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class MyWorkspaceResolver {
  constructor(private readonly myWorkspaceService: MyWorkspaceService) {}

  @Query(() => MyWorkspaceDataDTO)
  async myWorkspaceData(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<MyWorkspaceDataDTO> {
    const data = await this.myWorkspaceService.getMyWorkspaceData(
      user.id,
      workspace.id,
    );

    const employee = data.employee;
    const attendanceToday = data.attendanceToday;

    const leaveBalanceList = data.leaveBalances.map((balance) => ({
      id: balance.id,
      leaveTypeId: balance.leaveTypeId ?? null,
      year: balance.year ?? null,
      entitled: balance.entitled ?? 0,
      used: balance.used ?? 0,
      pending: balance.pending ?? 0,
      available:
        (balance.entitled ?? 0) -
        (balance.used ?? 0) -
        (balance.pending ?? 0),
    }));

    return {
      hasEmployeeRecord: employee !== null,
      employeeId: employee?.id ?? null,
      attendanceStatus: attendanceToday?.status ?? null,
      firstCheckIn: toIsoStringOrNull(attendanceToday?.firstCheckIn),
      lastCheckOut: toIsoStringOrNull(attendanceToday?.lastCheckOut),
      workedMinutes: attendanceToday?.workedMinutes ?? null,
      pendingLeaveRequests: data.pendingLeaveRequests.length,
      leaveBalanceDays: leaveBalanceList.reduce(
        (sum, balance) => sum + balance.available,
        0,
      ),
      recentPayslipCount: data.recentPayslips.length,
      announcementCount: data.announcements.length,
      pendingLeaveRequestList: data.pendingLeaveRequests.map((request) => ({
        id: request.id,
        leaveTypeId: request.leaveTypeId ?? null,
        startDate: toIsoStringOrNull(request.startDate),
        endDate: toIsoStringOrNull(request.endDate),
        days: request.days ?? null,
        status: request.status ?? null,
        reason: request.reason ?? null,
      })),
      leaveBalanceList,
      recentPayslipList: data.recentPayslips.map((payslip) => ({
        id: payslip.id,
        payrollPeriodId: payslip.payrollPeriodId ?? null,
        netPayAmountMicros: payslip.netPay?.amountMicros ?? null,
        currencyCode:
          payslip.netPay?.currencyCode ?? payslip.currency ?? null,
        paymentStatus: payslip.paymentStatus ?? null,
        paidAt: toIsoStringOrNull(payslip.paidAt),
      })),
      announcementList: data.announcements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        body: announcement.body ?? null,
        publishAt: toIsoStringOrNull(announcement.publishAt),
      })),
      stats: {
        pendingTasks: data.stats.pendingTasks,
        unreadNotifications: data.stats.unreadNotifications,
        upcomingLeave: data.stats.upcomingLeave,
      },
    };
  }
}
