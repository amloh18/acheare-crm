import { Command } from 'nest-commander';

import { ProvisionedWorkspaceCommandRunner } from 'src/database/commands/command-runners/provisioned-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { TwentyStandardApplicationService } from 'src/engine/workspace-manager/twenty-standard-application/services/twenty-standard-application.service';

@RegisteredWorkspaceCommand('2.26.0', 1785420710000)
@Command({
  name: 'upgrade:2-26:sync-achare-navigation-menu-items',
  description:
    'Sync ACHARE navigation menu items for existing workspaces by re-running the twenty-standard application synchronization',
})
export class SyncAchareNavigationMenuItemsCommand extends ProvisionedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly twentyStandardApplicationService: TwentyStandardApplicationService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Syncing ACHARE navigation menu items for workspace ${workspaceId}`,
    );

    if (isDryRun) {
      return;
    }

    try {
      await this.twentyStandardApplicationService.synchronizeTwentyStandardApplicationOrThrow(
        { workspaceId },
      );

      this.logger.log(
        `Successfully synced ACHARE navigation menu items for workspace ${workspaceId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to sync ACHARE navigation menu items for workspace ${workspaceId}: ${error.message}`,
      );
      throw error;
    }
  }
}
