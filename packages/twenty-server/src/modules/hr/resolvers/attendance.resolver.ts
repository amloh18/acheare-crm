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
import { AttendanceService } from 'src/modules/hr/services/attendance.service';
import {
  CheckInInputDTO,
  CheckOutInputDTO,
  RequestAttendanceCorrectionInputDTO,
  ReviewAttendanceCorrectionInputDTO,
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
  constructor(private readonly attendanceService: AttendanceService) {}

  @Mutation(() => AttendanceEventDTO)
  async checkIn(
    @Args('input') input: CheckInInputDTO,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceEventDTO> {
    const event = await this.attendanceService.checkIn(
      input.employeeId || user.id,
      workspace.id,
      input.timestamp ? new Date(input.timestamp) : undefined,
    );

    return {
      id: event.id,
      employeeId: event.employeeId ?? '',
      eventType: event.eventType ?? '',
      timestamp: event.timestamp
        ? new Date(event.timestamp as unknown as string).toISOString()
        : null,
      source: event.source ?? '',
    };
  }

  @Mutation(() => AttendanceEventDTO)
  async checkOut(
    @Args('input') input: CheckOutInputDTO,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceEventDTO> {
    const event = await this.attendanceService.checkOut(
      input.employeeId || user.id,
      workspace.id,
      input.timestamp ? new Date(input.timestamp) : undefined,
    );

    return {
      id: event.id,
      employeeId: event.employeeId ?? '',
      eventType: event.eventType ?? '',
      timestamp: event.timestamp
        ? new Date(event.timestamp as unknown as string).toISOString()
        : null,
      source: event.source ?? '',
    };
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
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AttendanceCorrectionDTO> {
    const correction = await this.attendanceService.reviewCorrection(
      input.correctionId,
      input.approved,
      user.id,
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
