import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { CompanySettingsService } from 'src/modules/hr/services/company-settings.service';
import {
  UpsertCompanySettingsInputDTO,
  CompanySettingsDTO,
} from 'src/modules/hr/dtos/company-settings.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class CompanySettingsResolver {
  constructor(private readonly companySettingsService: CompanySettingsService) {}

  @Query(() => CompanySettingsDTO, { nullable: true })
  async getCompanySettings(
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<CompanySettingsDTO | null> {
    return this.companySettingsService.getCompanySettings(workspaceId) as any;
  }

  @Mutation(() => CompanySettingsDTO)
  async upsertCompanySettings(
    @Args('input') input: UpsertCompanySettingsInputDTO,
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<CompanySettingsDTO> {
    return this.companySettingsService.upsertCompanySettings(input, workspaceId) as any;
  }
}
