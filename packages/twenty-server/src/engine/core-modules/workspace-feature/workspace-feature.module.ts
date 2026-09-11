import { Module } from '@nestjs/common';

import { KeyValuePairModule } from 'src/engine/core-modules/key-value-pair/key-value-pair.module';
import { WorkspaceFeatureService } from 'src/engine/core-modules/workspace-feature/services/workspace-feature.service';
import { WorkspaceFeatureResolver } from 'src/engine/core-modules/workspace-feature/workspace-feature.resolver';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';

@Module({
  imports: [KeyValuePairModule, PermissionsModule],
  exports: [WorkspaceFeatureService],
  providers: [WorkspaceFeatureService, WorkspaceFeatureResolver],
})
export class WorkspaceFeatureModule {}
