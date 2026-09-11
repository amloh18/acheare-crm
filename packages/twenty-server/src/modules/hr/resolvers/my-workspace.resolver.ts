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

    return {
      hasEmployeeRecord: employee !== null,
      employeeId: employee?.id ?? null,
      attendanceStatus: attendanceToday?.status ?? null,
      firstCheckIn: attendanceToday?.firstCheckIn
        ? new Date(attendanceToday.firstCheckIn as unknown as string).toISOString()
        : null,
      lastCheckOut: attendanceToday?.lastCheckOut
        ? new Date(attendanceToday.lastCheckOut as unknown as string).toISOString()
        : null,
      workedMinutes: attendanceToday?.workedMinutes ?? null,
      pendingLeaveRequests: data.pendingLeaveRequests.length,
      leaveBalanceDays: data.leaveBalances.reduce(
        (sum, b) =>
          sum +
          ((b.entitled || 0) - (b.used || 0) - (b.pending || 0)),
        0,
      ),
      recentPayslipCount: data.recentPayslips.length,
      announcementCount: data.announcements.length,
      stats: {
        pendingTasks: data.stats.pendingTasks,
        unreadNotifications: data.stats.unreadNotifications,
        upcomingLeave: data.stats.upcomingLeave,
      },
    };
  }
}
