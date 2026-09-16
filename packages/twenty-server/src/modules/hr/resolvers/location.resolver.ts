import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { LocationService } from 'src/modules/hr/services/location.service';
import {
  CreateLocationInputDTO,
  UpdateLocationInputDTO,
  LocationDTO,
} from 'src/modules/hr/dtos/location.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Query(() => [LocationDTO])
  async getLocations(
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<LocationDTO[]> {
    return this.locationService.getLocations(workspaceId) as any;
  }

  @Query(() => LocationDTO, { nullable: true })
  async getLocation(
    @Args('locationId') locationId: string,
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<LocationDTO | null> {
    return this.locationService.getLocationById(locationId, workspaceId) as any;
  }

  @Mutation(() => LocationDTO)
  async createLocation(
    @Args('input') input: CreateLocationInputDTO,
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<LocationDTO> {
    return this.locationService.createLocation(input, workspaceId) as any;
  }

  @Mutation(() => LocationDTO)
  async updateLocation(
    @Args('locationId') locationId: string,
    @Args('input') input: UpdateLocationInputDTO,
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<LocationDTO> {
    return this.locationService.updateLocation(locationId, input, workspaceId) as any;
  }

  @Mutation(() => Boolean)
  async deleteLocation(
    @Args('locationId') locationId: string,
    @AuthWorkspace() { workspaceId }: { workspaceId: string },
  ): Promise<boolean> {
    return this.locationService.deleteLocation(locationId, workspaceId);
  }
}
