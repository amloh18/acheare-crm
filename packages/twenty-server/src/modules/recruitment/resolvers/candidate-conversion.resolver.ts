import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { CandidateConversionService } from 'src/modules/recruitment/services/candidate-conversion.service';
import {
  ConvertCandidateToEmployeeInputDTO,
  ConversionResultDTO,
  ConversionHistoryEntryDTO,
} from 'src/modules/recruitment/dtos/candidate-conversion.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class CandidateConversionResolver {
  constructor(private readonly candidateConversionService: CandidateConversionService) {}

  @Mutation(() => ConversionResultDTO)
  async convertCandidateToEmployee(
    @Args('input') input: ConvertCandidateToEmployeeInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ConversionResultDTO> {
    const result = await this.candidateConversionService.convertCandidateToEmployee(
      input.candidateId,
      input.submissionId,
      workspace.id,
      {
        departmentId: input.departmentId,
        teamId: input.teamId,
        designationId: input.designationId,
        locationId: input.locationId,
        managerId: input.managerId,
        joiningDate: input.joiningDate ? new Date(input.joiningDate) : undefined,
        employeeCode: input.employeeCode,
      },
    );

    return {
      employeeId: result.employee.id,
      candidateId: result.candidate.id,
      onboardingItemsCreated: result.onboardingItems.length,
    };
  }

  @Query(() => [ConversionHistoryEntryDTO])
  async conversionHistory(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ConversionHistoryEntryDTO[]> {
    const history = await this.candidateConversionService.getConversionHistory(
      workspace.id,
    );

    return history.map((h) => ({
      candidateId: h.candidateId,
      candidateName: h.candidateName,
      employeeId: h.employeeId,
      convertedAt: h.convertedAt.toISOString(),
    }));
  }
}
