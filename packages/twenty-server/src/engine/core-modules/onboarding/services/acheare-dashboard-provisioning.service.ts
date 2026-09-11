import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';

import { isAchareDashboardEnabled } from 'twenty-shared/workspace';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

export interface DashboardProvisionConfig {
  dashboardTypes: string[];
}

export interface ProvisionedDashboard {
  id: string;
  title: string;
  pageLayoutId: string | null;
  widgets: DashboardWidgetConfig[];
}

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  title: string;
  objectMetadataName: string;
  viewFilter?: Record<string, unknown>;
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
    enabledFeatures,
  }: {
    workspaceId: string;
    config: DashboardProvisionConfig;
    /**
     * The workspace's enabled Achare features. When provided, dashboards whose
     * every widget belongs to a module the workspace does not have are skipped
     * — provisioning them would only create an empty shell. `undefined` (an
     * unconfigured workspace) provisions the full requested set.
     */
    enabledFeatures?: readonly string[];
  }): Promise<ProvisionedDashboard[]> {
    const provisioned: ProvisionedDashboard[] = [];

    for (const dashboardType of this.getProvisionableDashboardTypes({
      config,
      enabledFeatures,
    })) {
      try {
        const dashboard = await this.createDashboard(
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

  /**
   * Feature composition is workspace-wide, so a role dashboard is only worth
   * creating when at least one of the objects it reports on is enabled.
   */
  private getProvisionableDashboardTypes({
    config,
    enabledFeatures,
  }: {
    config: DashboardProvisionConfig;
    enabledFeatures?: readonly string[];
  }): string[] {
    if (enabledFeatures === undefined) {
      return config.dashboardTypes;
    }

    return config.dashboardTypes.filter((dashboardType) =>
      isAchareDashboardEnabled({
        widgetStandardObjectKeys: this.getDashboardWidgets(dashboardType).map(
          (widget) => widget.objectMetadataName,
        ),
        enabledFeatures,
      }),
    );
  }

  private async createDashboard(
    workspaceId: string,
    dashboardType: string,
  ): Promise<ProvisionedDashboard> {
    const title = this.getDashboardTitle(dashboardType);
    const dashboardId = uuidv4();
    const widgets = this.getDashboardWidgets(dashboardType);

    this.logger.log(
      `Provisioned ${title} dashboard (${dashboardId}) for workspace ${workspaceId}`,
    );

    return {
      id: dashboardId,
      title,
      pageLayoutId: null,
      widgets,
    };
  }

  private getDashboardTitle(dashboardType: string): string {
    const titleMap: Record<string, string> = {
      Management: 'Management Dashboard',
      BDE: 'Sales Dashboard',
      HR: 'HR Dashboard',
      Recruiter: 'Recruitment Dashboard',
      Employee: 'My Workspace',
    };

    return titleMap[dashboardType] ?? `${dashboardType} Dashboard`;
  }

  private getDashboardWidgets(dashboardType: string): DashboardWidgetConfig[] {
    const widgetConfigs: Record<string, DashboardWidgetConfig[]> = {
      Management: [
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Employees',
          objectMetadataName: 'employee',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Open Requirements',
          objectMetadataName: 'requirement',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Candidates',
          objectMetadataName: 'candidate',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Open Invoices',
          objectMetadataName: 'invoice',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Recent Activity',
          objectMetadataName: 'timelineActivity',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Upcoming Interviews',
          objectMetadataName: 'interview',
        },
      ],
      BDE: [
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'My Companies',
          objectMetadataName: 'company',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'My Contacts',
          objectMetadataName: 'person',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'My Opportunities',
          objectMetadataName: 'opportunity',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Open Requirements',
          objectMetadataName: 'requirement',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Pipeline',
          objectMetadataName: 'opportunity',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'My Tasks',
          objectMetadataName: 'task',
        },
      ],
      HR: [
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Total Employees',
          objectMetadataName: 'employee',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Pending Leave Requests',
          objectMetadataName: 'leaveRequest',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Pending Onboarding',
          objectMetadataName: 'onboardingItem',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Recent Joiners',
          objectMetadataName: 'employee',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Leave Requests',
          objectMetadataName: 'leaveRequest',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Attendance Overview',
          objectMetadataName: 'attendanceDay',
        },
      ],
      Recruiter: [
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Open Requirements',
          objectMetadataName: 'requirement',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Total Candidates',
          objectMetadataName: 'candidate',
        },
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'Upcoming Interviews',
          objectMetadataName: 'interview',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Active Requirements',
          objectMetadataName: 'requirement',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Recent Submissions',
          objectMetadataName: 'candidateSubmission',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'Today\'s Interviews',
          objectMetadataName: 'interview',
        },
      ],
      Employee: [
        {
          id: uuidv4(),
          type: 'record-count',
          title: 'My Tasks',
          objectMetadataName: 'task',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'My Recent Activity',
          objectMetadataName: 'timelineActivity',
        },
        {
          id: uuidv4(),
          type: 'record-table',
          title: 'My Documents',
          objectMetadataName: 'attachment',
        },
      ],
    };

    return widgetConfigs[dashboardType] || widgetConfigs.Employee || [];
  }
}
