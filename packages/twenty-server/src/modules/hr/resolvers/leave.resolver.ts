import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { LeaveService } from 'src/modules/hr/services/leave.service';
import {
  RequestLeaveInputDTO,
  ReviewLeaveInputDTO,
  CancelLeaveInputDTO,
  LeaveRequestDTO,
  LeaveBalanceDTO,
} from 'src/modules/hr/dtos/leave.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class LeaveResolver {
  constructor(private readonly leaveService: LeaveService) {}

  @Mutation(() => LeaveRequestDTO)
  async requestLeave(
    @Args('input') input: RequestLeaveInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveRequestDTO> {
    const request = await this.leaveService.requestLeave(
      input.employeeId,
      input.leaveTypeId,
      new Date(input.startDate),
      new Date(input.endDate),
      input.reason,
      workspace.id,
    );

    return this.mapLeaveRequest(request);
  }

  @Mutation(() => LeaveRequestDTO)
  async approveLeave(
    @Args('input') input: ReviewLeaveInputDTO,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveRequestDTO> {
    const request = await this.leaveService.approveLeave(
      input.leaveRequestId,
      user.id,
      input.reviewNotes || '',
      workspace.id,
    );

    return this.mapLeaveRequest(request);
  }

  @Mutation(() => LeaveRequestDTO)
  async rejectLeave(
    @Args('input') input: ReviewLeaveInputDTO,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveRequestDTO> {
    const request = await this.leaveService.rejectLeave(
      input.leaveRequestId,
      user.id,
      input.reviewNotes || '',
      workspace.id,
    );

    return this.mapLeaveRequest(request);
  }

  @Mutation(() => LeaveRequestDTO)
  async cancelLeave(
    @Args('input') input: CancelLeaveInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveRequestDTO> {
    const request = await this.leaveService.cancelLeave(
      input.leaveRequestId,
      input.employeeId,
      workspace.id,
    );

    return this.mapLeaveRequest(request);
  }

  @Query(() => [LeaveBalanceDTO])
  async leaveBalance(
    @Args('employeeId') employeeId: string,
    @Args('year') year: number,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<LeaveBalanceDTO[]> {
    const balances = await this.leaveService.getLeaveBalance(
      employeeId,
      year,
      workspace.id,
    );

    return balances.map((b) => ({
      id: b.id,
      employeeId: b.employeeId ?? '',
      leaveTypeId: b.leaveTypeId ?? '',
      year: b.year ?? 0,
      entitled: b.entitled || 0,
      used: b.used || 0,
      pending: b.pending || 0,
    }));
  }

  @Query(() => Number)
  async availableLeaveDays(
    @Args('employeeId') employeeId: string,
    @Args('leaveTypeId') leaveTypeId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<number> {
    return this.leaveService.getAvailableLeaveDays(
      employeeId,
      leaveTypeId,
      workspace.id,
    );
  }

  private mapLeaveRequest(request: any): LeaveRequestDTO {
    return {
      id: request.id,
      employeeId: request.employeeId,
      leaveTypeId: request.leaveTypeId,
      startDate: request.startDate
        ? new Date(request.startDate as unknown as string).toISOString()
        : '',
      endDate: request.endDate
        ? new Date(request.endDate as unknown as string).toISOString()
        : '',
      days: request.days || 0,
      reason: request.reason || '',
      status: request.status,
      reviewedAt: request.reviewedAt
        ? new Date(request.reviewedAt as unknown as string).toISOString()
        : null,
      reviewedById: request.reviewedById || null,
      reviewNotes: request.reviewNotes || null,
    };
  }
}
