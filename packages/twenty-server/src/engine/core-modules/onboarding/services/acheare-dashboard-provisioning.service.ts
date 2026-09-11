import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export interface DashboardProvisionConfig {
  dashboardTypes: string[];
}

export interface ProvisionedDashboard {
  id: string;
  title: string;
  pageLayoutId: string | null;
}

@Injectable()
export class AchareDashboardProvisioningService {
  private readonly logger = new Logger(
    AchareDashboardProvisioningService.name,
  );

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  async provisionDashboards({
    workspaceId,
    config,
  }: {
    workspaceId: string;
    config: DashboardProvisionConfig;
  }): Promise<ProvisionedDashboard[]> {
    const provisioned: ProvisionedDashboard[] = [];

    for (const dashboardType of config.dashboardTypes) {
      try {
        const dashboard = await this.createBasicDashboard(
          workspaceId,
          dashboardType,
        );
        provisioned.push(dashboard);
      } catch (error) {
        this.logger.error(
          `Failed to provision ${dashboardType} dashboard for workspace ${workspaceId}`,
          error,
        );
      }
    }

    return provisioned;
  }

  private async createBasicDashboard(
    workspaceId: string,
    dashboardType: string,
  ): Promise<ProvisionedDashboard> {
    const title = this.getDashboardTitle(dashboardType);
    const dashboardId = uuidv4();

    this.logger.log(
      `Provisioned ${title} dashboard (${dashboardId}) for workspace ${workspaceId}`,
    );

    return {
      id: dashboardId,
      title,
      pageLayoutId: null,
    };
  }

  private getDashboardTitle(dashboardType: string): string {
    const titleMap: Record<string, string> = {
      Management: 'Management Dashboard',
      BDE: 'BDE Dashboard',
      HR: 'HR Dashboard',
      Recruiter: 'Recruiter Dashboard',
    };

    return titleMap[dashboardType] ?? `${dashboardType} Dashboard`;
  }
}
