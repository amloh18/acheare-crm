import { Injectable } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { LocationWorkspaceEntity } from 'src/modules/hr/standard-objects/location.workspace-entity';

export type LocationInput = {
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  timezone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geofenceRadiusMeters?: number | null;
  isActive?: boolean;
};

@Injectable()
export class LocationService {
  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  private getRepository(workspaceId: string) {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        return this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
          'location',
          { shouldBypassPermissionChecks: true },
        );
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getLocations(workspaceId: string): Promise<LocationWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
            'location',
            { shouldBypassPermissionChecks: true },
          );

        return repository.find({
          where: { isActive: true },
          order: { name: 'ASC' },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getLocationById(
    locationId: string,
    workspaceId: string,
  ): Promise<LocationWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
            'location',
            { shouldBypassPermissionChecks: true },
          );

        return repository.findOne({ where: { id: locationId } });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async createLocation(
    input: LocationInput,
    workspaceId: string,
  ): Promise<LocationWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
            'location',
            { shouldBypassPermissionChecks: true },
          );

        const created = await repository.save({
          name: input.name,
          address: input.address || null,
          city: input.city || null,
          state: input.state || null,
          country: input.country || null,
          timezone: input.timezone || null,
          latitude: input.latitude || null,
          longitude: input.longitude || null,
          geofenceRadiusMeters: input.geofenceRadiusMeters || 100,
          isActive: input.isActive ?? true,
        });

        return created as unknown as LocationWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async updateLocation(
    locationId: string,
    input: Partial<LocationInput>,
    workspaceId: string,
  ): Promise<LocationWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
            'location',
            { shouldBypassPermissionChecks: true },
          );

        const existing = await repository.findOne({
          where: { id: locationId },
        });

        if (!existing) {
          throw new Error('Location not found');
        }

        const updated = await repository.save({
          ...existing,
          ...input,
        });

        return updated as unknown as LocationWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async deleteLocation(
    locationId: string,
    workspaceId: string,
  ): Promise<boolean> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
            'location',
            { shouldBypassPermissionChecks: true },
          );

        await repository.save({
          id: locationId,
          isActive: false,
        } as Partial<LocationWorkspaceEntity>);

        return true;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async findNearestLocation(
    latitude: number,
    longitude: number,
    workspaceId: string,
  ): Promise<{ location: LocationWorkspaceEntity; distanceMeters: number } | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<LocationWorkspaceEntity>(
            'location',
            { shouldBypassPermissionChecks: true },
          );

        const locations = await repository.find({
          where: { isActive: true },
        });

        let nearest: { location: LocationWorkspaceEntity; distanceMeters: number } | null = null;

        for (const location of locations) {
          if (location.latitude == null || location.longitude == null) continue;

          const distance = this.calculateDistance(
            latitude,
            longitude,
            location.latitude,
            location.longitude,
          );

          const radius = location.geofenceRadiusMeters || 100;

          if (distance <= radius) {
            if (!nearest || distance < nearest.distanceMeters) {
              nearest = { location, distanceMeters: distance };
            }
          }
        }

        return nearest;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
