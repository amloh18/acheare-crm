import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspaceMemberId } from 'src/engine/decorators/auth/auth-workspace-member-id.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { MyWorkspaceService } from 'src/modules/hr/services/my-workspace.service';
import { AnnouncementWorkspaceEntity } from 'src/modules/hr/standard-objects/announcement.workspace-entity';
import {
  AnnouncementDTO,
  PublishAnnouncementInputDTO,
} from 'src/modules/hr/dtos/announcement.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class AnnouncementResolver {
  constructor(private readonly myWorkspaceService: MyWorkspaceService) {}

  @Mutation(() => AnnouncementDTO)
  async publishAnnouncement(
    @Args('input') input: PublishAnnouncementInputDTO,
    @AuthWorkspaceMemberId() workspaceMemberId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnnouncementDTO> {
    const announcement = await this.myWorkspaceService.publishAnnouncement(
      input.title,
      input.body || '',
      workspaceMemberId,
      input.audience || 'ALL',
      input.targetDepartmentIds,
      input.targetTeamIds,
      input.expiresAt ? new Date(input.expiresAt) : undefined,
      workspace.id,
    );

    return this.mapAnnouncement(announcement);
  }

  @Query(() => [AnnouncementDTO])
  async announcementsForEmployee(
    @Args('employeeId') employeeId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<AnnouncementDTO[]> {
    const announcements =
      await this.myWorkspaceService.getAnnouncementsForEmployee(
        employeeId,
        workspace.id,
      );

    return announcements.map((announcement) =>
      this.mapAnnouncement(announcement),
    );
  }

  private mapAnnouncement(
    announcement: AnnouncementWorkspaceEntity,
  ): AnnouncementDTO {
    return {
      id: announcement.id,
      title: announcement.title,
      body: announcement.body ?? null,
      audience: announcement.audience ?? null,
      authorId: announcement.authorId ?? null,
      publishAt: announcement.publishAt
        ? new Date(announcement.publishAt).toISOString()
        : null,
      expiresAt: announcement.expiresAt
        ? new Date(announcement.expiresAt).toISOString()
        : null,
    };
  }
}
