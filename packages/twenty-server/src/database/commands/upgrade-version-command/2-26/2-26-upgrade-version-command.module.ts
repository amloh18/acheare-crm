import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { ReconcileIndexViewUniversalIdentifierCommand } from 'src/database/commands/upgrade-version-command/2-26/2-26-workspace-command-1785255689000-reconcile-index-view-universal-identifier.command';
import { DemoteAndBackfillApplicationIndexViewCommand } from 'src/database/commands/upgrade-version-command/2-26/2-26-workspace-command-1785255690000-demote-and-backfill-application-index-view.command';
import { AddNotRecordedCallRecordingStatusCommand } from 'src/database/commands/upgrade-version-command/2-26/2-26-workspace-command-1785334800000-add-not-recorded-call-recording-status.command';
import { SyncAchareNavigationMenuItemsCommand } from 'src/database/commands/upgrade-version-command/2-26/2-26-workspace-command-1785420710000-sync-achare-navigation-menu-items.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ViewEntity } from 'src/engine/metadata-modules/view/entities/view.entity';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationRunnerModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';
import { TwentyStandardApplicationModule } from 'src/engine/workspace-manager/twenty-standard-application/twenty-standard-application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldMetadataEntity, ViewEntity]),
    ApplicationModule,
    WorkspaceCacheModule,
    WorkspaceMigrationModule,
    WorkspaceMigrationRunnerModule,
    WorkspaceIteratorModule,
    TwentyStandardApplicationModule,
  ],
  providers: [
    ReconcileIndexViewUniversalIdentifierCommand,
    DemoteAndBackfillApplicationIndexViewCommand,
    AddNotRecordedCallRecordingStatusCommand,
    SyncAchareNavigationMenuItemsCommand,
  ],
})
export class V2_26_UpgradeVersionCommandModule {}
