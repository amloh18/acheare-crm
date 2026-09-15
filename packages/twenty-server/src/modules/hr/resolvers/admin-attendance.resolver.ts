import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { AuthWorkspaceMemberId } from 'src/engine/decorators/auth/auth-workspace-member-id.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { AdminAttendanceService } from 'src/modules/hr/services/admin-attendance.service';
import { LeaveService } from 'src/modules/hr/services/leave.service';
import {
  AllEmployeesAttendanceInputDTO,
  AllEmployeesAttendanceSummaryDTO,
  AllLeaveRequestsInputDTO,
  AllLeaveRequestsResultDTO,
  LeaveTypeDTO,
} from 'src/modules/hr/dtos/admin-attendance.dto';
import { LeaveBalanceDTO } from 'src/modules/hr/dtos/leave.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class AdminAttendanceResolver {
  constructor(
    private readonly adminAttendanceService: AdminAttendanceService,
    private readonly leaveService: LeaveService,
  ) {}

  @Query(() => AllEmployeesAttendanceSummaryDTO)
  async allEmployeesAttendance(
    @Args('input') input: AllEmployeesAttendanceInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AllEmployeesAttendanceSummaryDTO> {
    const result = await this.adminAttendanceService.getAllEmployeesAttendance(
      workspace.id,
      new Date(input.startDate),
      new Date(input.endDate),
      input.departmentId,
      input.status,
    );

    return {
      presentToday: result.presentToday,
      lateEntry: result.lateEntry,
      onLeave: result.onLeave,
      absent: result.absent,
      totalEmployees: result.totalEmployees,
      employees: result.employees,
    };
  }

  @Query(() => AllLeaveRequestsResultDTO)
  async allLeaveRequests(
    @Args('input', { nullable: true }) input: AllLeaveRequestsInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AllLeaveRequestsResultDTO> {
    const result = await this.adminAttendanceService.getAllLeaveRequests(
      workspace.id,
      input?.status,
      input?.employeeId,
      input?.leaveTypeId,
    );

    return {
      requests: result.requests,
      totalCount: result.totalCount,
      pendingCount: result.pendingCount,
      approvedCount: result.approvedCount,
      rejectedCount: result.rejectedCount,
    };
  }

  @Query(() => [LeaveTypeDTO])
  async leaveTypes(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveTypeDTO[]> {
    return this.adminAttendanceService.getLeaveTypes(workspace.id);
  }

  @Query(() => [LeaveBalanceDTO])
  async employeeLeaveBalance(
    @Args('employeeId') employeeId: string,
    @Args('year') year: number,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveBalanceDTO[]> {
    return this.leaveService.getLeaveBalance(employeeId, year, workspace.id);
  }

  @Mutation(() => Boolean)
  async approveLeaveRequest(
    @Args('leaveRequestId') leaveRequestId: string,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<boolean> {
    await this.leaveService.approveLeave(
      leaveRequestId,
      workspaceMemberId,
      '',
      workspace.id,
    );
    return true;
  }

  @Mutation(() => Boolean)
  async rejectLeaveRequest(
    @Args('leaveRequestId') leaveRequestId: string,
    @Args('reviewNotes', { nullable: true }) reviewNotes: string,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<boolean> {
    await this.leaveService.rejectLeave(
      leaveRequestId,
      workspaceMemberId,
      reviewNotes || '',
      workspace.id,
    );
    return true;
  }
}
