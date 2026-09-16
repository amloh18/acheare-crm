import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspaceMemberId } from 'src/engine/decorators/auth/auth-workspace-member-id.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { AttendanceService } from 'src/modules/hr/services/attendance.service';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import {
  CheckInInputDTO,
  CheckOutInputDTO,
  RequestAttendanceCorrectionInputDTO,
  ReviewAttendanceCorrectionInputDTO,
  ApproveRemoteCheckInInputDTO,
  AttendanceEventDTO,
  AttendanceCorrectionDTO,
  AttendanceSummaryDTO,
  AttendanceOperationSuccessDTO,
} from 'src/modules/hr/dtos/attendance.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class AttendanceResolver {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  private async resolveEmployeeId(
    userId: string,
    workspaceId: string,
    explicitEmployeeId?: string,
  ): Promise<string> {
    if (explicitEmployeeId) return explicitEmployeeId;

    return this.workspaceOrmManager.executeInWorkspaceContext(async () => {
      const employeeRepo =
        this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
          'employee',
        );

      const employee = await employeeRepo.findOne({
        where: { personId: userId },
      });

      if (!employee) {
        throw new Error('No employee record found for this user');
      }

      return employee.id;
    }, { userId, workspaceId });
  }

  @Mutation(() => AttendanceEventDTO)
  async checkIn(
    @Args('input') input: CheckInInputDTO,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceEventDTO> {
    const employeeId = await this.resolveEmployeeId(
      user.id,
      workspace.id,
      input.employeeId,
    );

    const event = await this.attendanceService.checkIn(
      employeeId,
      workspace.id,
      input.timestamp ? new Date(input.timestamp) : undefined,
      input.latitude,
      input.longitude,
    );

    return {
      id: event.id,
      employeeId: event.employeeId ?? '',
      eventType: event.eventType ?? '',
      timestamp: event.timestamp
        ? new Date(event.timestamp as unknown as string).toISOString()
        : null,
      source: event.source ?? '',
      latitude: event.latitude,
      longitude: event.longitude,
      locationName: event.locationName,
      isRemote: event.isRemote,
      approvalStatus: event.approvalStatus,
    };
  }

  @Mutation(() => AttendanceEventDTO)
  async checkOut(
    @Args('input') input: CheckOutInputDTO,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceEventDTO> {
    const employeeId = await this.resolveEmployeeId(
      user.id,
      workspace.id,
      input.employeeId,
    );

    const event = await this.attendanceService.checkOut(
      employeeId,
      workspace.id,
      input.timestamp ? new Date(input.timestamp) : undefined,
      input.latitude,
      input.longitude,
    );

    return {
      id: event.id,
      employeeId: event.employeeId ?? '',
      eventType: event.eventType ?? '',
      timestamp: event.timestamp
        ? new Date(event.timestamp as unknown as string).toISOString()
        : null,
      source: event.source ?? '',
      latitude: event.latitude,
      longitude: event.longitude,
      locationName: event.locationName,
      isRemote: event.isRemote,
      approvalStatus: event.approvalStatus,
    };
  }

  @Mutation(() => AttendanceEventDTO)
  async approveRemoteCheckIn(
    @Args('input') input: ApproveRemoteCheckInInputDTO,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceEventDTO> {
    const event = await this.attendanceService.approveRemoteCheckIn(
      input.eventId,
      input.approved,
      workspaceMemberId,
      workspace.id,
    );

    return {
      id: event.id,
      employeeId: event.employeeId ?? '',
      eventType: event.eventType ?? '',
      timestamp: event.timestamp
        ? new Date(event.timestamp as unknown as string).toISOString()
        : null,
      source: event.source ?? '',
      latitude: event.latitude,
      longitude: event.longitude,
      locationName: event.locationName,
      isRemote: event.isRemote,
      approvalStatus: event.approvalStatus,
    };
  }

  @Query(() => [AttendanceEventDTO])
  async pendingRemoteCheckIns(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceEventDTO[]> {
    const events = await this.attendanceService.getPendingRemoteCheckIns(
      workspace.id,
    );

    return events.map((event) => ({
      id: event.id,
      employeeId: event.employeeId ?? '',
      eventType: event.eventType ?? '',
      timestamp: event.timestamp
        ? new Date(event.timestamp as unknown as string).toISOString()
        : null,
      source: event.source ?? '',
      latitude: event.latitude,
      longitude: event.longitude,
      locationName: event.locationName,
      isRemote: event.isRemote,
      approvalStatus: event.approvalStatus,
    }));
  }

  @Mutation(() => AttendanceCorrectionDTO)
  async requestAttendanceCorrection(
    @Args('input') input: RequestAttendanceCorrectionInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceCorrectionDTO> {
    const correction = await this.attendanceService.requestCorrection(
      input.employeeId,
      new Date(input.workDate),
      new Date(input.requestedCheckIn),
      new Date(input.requestedCheckOut),
      input.reason,
      workspace.id,
    );

    return {
      id: correction.id,
      employeeId: correction.employeeId ?? '',
      workDate: correction.workDate
        ? new Date(correction.workDate as unknown as string).toISOString()
        : '',
      status: correction.status ?? '',
      reason: correction.reason ?? '',
      reviewedAt: correction.reviewedAt
        ? new Date(correction.reviewedAt as unknown as string).toISOString()
        : null,
    };
  }

  @Mutation(() => AttendanceCorrectionDTO)
  async reviewAttendanceCorrection(
    @Args('input') input: ReviewAttendanceCorrectionInputDTO,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceCorrectionDTO> {
    const correction = await this.attendanceService.reviewCorrection(
      input.correctionId,
      input.approved,
      workspaceMemberId,
      input.reviewNotes || '',
      workspace.id,
    );

    return {
      id: correction.id,
      employeeId: correction.employeeId ?? '',
      workDate: correction.workDate
        ? new Date(correction.workDate as unknown as string).toISOString()
        : '',
      status: correction.status ?? '',
      reason: correction.reason ?? '',
      reviewedAt: correction.reviewedAt
        ? new Date(correction.reviewedAt as unknown as string).toISOString()
        : null,
    };
  }

  @Query(() => AttendanceSummaryDTO)
  async attendanceSummary(
    @Args('employeeId') employeeId: string,
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceSummaryDTO> {
    const summary = await this.attendanceService.getAttendanceSummary(
      employeeId,
      new Date(startDate),
      new Date(endDate),
      workspace.id,
    );

    return {
      present: summary.present,
      absent: summary.absent,
      late: summary.late,
      halfDay: summary.halfDay,
      leave: summary.leave,
      holidays: summary.holidays,
      totalWorkedMinutes: summary.totalWorkedMinutes,
      totalOvertimeMinutes: summary.totalOvertimeMinutes,
    };
  }
}
