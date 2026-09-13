import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type PageLayout } from '@/page-layout/types/PageLayout';
import { type PageLayoutTab } from '@/page-layout/types/PageLayoutTab';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import {
  FieldDisplayMode,
  PageLayoutTabLayoutMode,
  PageLayoutType,
  WidgetConfigurationType,
  WidgetType,
} from '~/generated-metadata/graphql';
import { isDefined } from 'twenty-shared/utils';

const KEY_RELATION_FIELD_NAMES: Record<string, string[]> = {
  requirement: [
    'company',
    'pointOfContact',
    'recruiterOwner',
    'hrOwner',
    'bdeOwner',
    'deal',
  ],
  candidateSubmission: ['candidate', 'requirement', 'recruiter', 'hrOwner'],
  interview: ['candidate', 'submission', 'requirement', 'company', 'owner'],
  attendanceDay: ['employee', 'shift'],
  leaveRequest: ['employee', 'leaveType', 'reviewedBy'],
  department: ['departmentHead', 'employees'],
  payrollPeriod: ['payslips', 'payrollAdjustments'],
  payslip: ['employee', 'payrollPeriod', 'lines'],
  salaryStructure: ['employee', 'components'],
  employee: ['department', 'designation', 'shift', 'workspaceMember'],
  candidate: ['noteTargets', 'taskTargets'],
  invoice: ['company', 'requirement'],
  payment: ['invoice'],
  shift: ['rosterAssignments'],
  salaryComponent: ['salaryStructure'],
  payrollAdjustment: ['employee', 'payrollPeriod'],
  leaveBalance: ['employee', 'leaveType'],
  onboardingItem: ['employee'],
  attendanceCorrection: ['attendanceDay'],
  attendanceEvent: ['attendanceDay'],
  rosterAssignment: ['shift', 'employee'],
  payslipLine: ['payslip', 'salaryComponent'],
};

export const buildFallbackRecordPageLayout = ({
  objectMetadataItem,
  fieldsWidgetViewId,
}: {
  objectMetadataItem: EnrichedObjectMetadataItem;
  fieldsWidgetViewId?: string | null;
}): PageLayout => {
  const pageLayoutId = `fallback-layout-${objectMetadataItem.id}`;
  const now = new Date().toISOString();
  const applicationId =
    objectMetadataItem.applicationId ?? '20202020-64aa-4b6f-b003-9c74b97cee20';

  const homeTabId = `fallback-tab-home-${objectMetadataItem.id}`;
  const homeWidgets: PageLayoutWidget[] = [
    {
      id: `fallback-widget-fields-${objectMetadataItem.id}`,
      pageLayoutTabId: homeTabId,
      title: 'Fields',
      type: WidgetType.FIELDS,
      objectMetadataId: objectMetadataItem.id,
      gridPosition: { row: 0, column: 0, rowSpan: 1, columnSpan: 12 },
      configuration: {
        viewId: fieldsWidgetViewId ?? null,
        configurationType: WidgetConfigurationType.FIELDS,
        newFieldDefaultVisibility: true,
      },
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalIdentifier: `universal-widget-fields-${objectMetadataItem.id}`,
      applicationId,
      conditionalDisplay: null,
      position: { index: 0, layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST },
      isActive: true,
      conditionalAvailabilityExpression: null,
      isSystemSideEffect: true,
    },
  ];

  const fields = objectMetadataItem.fields ?? [];
  const fieldNames = new Set(fields.map((f) => f.name));
  const keyRelations =
    KEY_RELATION_FIELD_NAMES[objectMetadataItem.nameSingular] ?? [];

  let widgetIndex = 1;
  for (const relName of keyRelations) {
    const relField = fields.find(
      (f) => f.name === relName && f.isActive,
    );
    if (isDefined(relField)) {
      homeWidgets.push({
        id: `fallback-widget-${relField.id}-${objectMetadataItem.id}`,
        pageLayoutTabId: homeTabId,
        title: relField.label,
        type: WidgetType.FIELD,
        objectMetadataId: objectMetadataItem.id,
        gridPosition: { row: 0, column: 0, rowSpan: 1, columnSpan: 12 },
        configuration: {
          fieldMetadataId: relField.id,
          fieldDisplayMode: FieldDisplayMode.CARD,
          configurationType: WidgetConfigurationType.FIELD,
        },
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        universalIdentifier: `universal-widget-${relField.id}-${objectMetadataItem.id}`,
        applicationId,
        conditionalDisplay: null,
        position: {
          index: widgetIndex++,
          layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
        },
          isActive: true,
        conditionalAvailabilityExpression: null,
        isSystemSideEffect: true,
      });
    }
  }

  const tabs: PageLayoutTab[] = [
    {
      id: homeTabId,
      title: 'Home',
      position: 10,
      pageLayoutId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalIdentifier: `universal-tab-home-${objectMetadataItem.id}`,
      applicationId,
      icon: 'IconHome',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      isActive: true,
      isSystemSideEffect: true,
      widgets: homeWidgets,
    },
  ];

  if (fieldNames.has('timelineActivities')) {
    const tabId = `fallback-tab-timeline-${objectMetadataItem.id}`;
    tabs.push({
      id: tabId,
      title: 'Timeline',
      position: 20,
      pageLayoutId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalIdentifier: `universal-tab-timeline-${objectMetadataItem.id}`,
      applicationId,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      isActive: true,
      isSystemSideEffect: true,
      widgets: [
        {
          id: `fallback-widget-timeline-${objectMetadataItem.id}`,
          pageLayoutTabId: tabId,
          title: 'Timeline',
          type: WidgetType.TIMELINE,
          objectMetadataId: objectMetadataItem.id,
          gridPosition: { row: 0, column: 0, rowSpan: 1, columnSpan: 12 },
          configuration: {
            configurationType: WidgetConfigurationType.TIMELINE,
          },
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          universalIdentifier: `universal-widget-timeline-${objectMetadataItem.id}`,
          applicationId,
          conditionalDisplay: null,
          position: {
            index: 0,
            layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
          },
              isActive: true,
          conditionalAvailabilityExpression: null,
          isSystemSideEffect: true,
        },
      ],
    });
  }

  if (fieldNames.has('taskTargets')) {
    const tabId = `fallback-tab-tasks-${objectMetadataItem.id}`;
    tabs.push({
      id: tabId,
      title: 'Tasks',
      position: 30,
      pageLayoutId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalIdentifier: `universal-tab-tasks-${objectMetadataItem.id}`,
      applicationId,
      icon: 'IconCheckbox',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      isActive: true,
      isSystemSideEffect: true,
      widgets: [
        {
          id: `fallback-widget-tasks-${objectMetadataItem.id}`,
          pageLayoutTabId: tabId,
          title: 'Tasks',
          type: WidgetType.TASKS,
          objectMetadataId: objectMetadataItem.id,
          gridPosition: { row: 0, column: 0, rowSpan: 1, columnSpan: 12 },
          configuration: {
            configurationType: WidgetConfigurationType.TASKS,
          },
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          universalIdentifier: `universal-widget-tasks-${objectMetadataItem.id}`,
          applicationId,
          conditionalDisplay: null,
          position: {
            index: 0,
            layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
          },
              isActive: true,
          conditionalAvailabilityExpression: null,
          isSystemSideEffect: true,
        },
      ],
    });
  }

  if (fieldNames.has('noteTargets')) {
    const tabId = `fallback-tab-notes-${objectMetadataItem.id}`;
    tabs.push({
      id: tabId,
      title: 'Notes',
      position: 40,
      pageLayoutId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalIdentifier: `universal-tab-notes-${objectMetadataItem.id}`,
      applicationId,
      icon: 'IconNotes',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      isActive: true,
      isSystemSideEffect: true,
      widgets: [
        {
          id: `fallback-widget-notes-${objectMetadataItem.id}`,
          pageLayoutTabId: tabId,
          title: 'Notes',
          type: WidgetType.NOTES,
          objectMetadataId: objectMetadataItem.id,
          gridPosition: { row: 0, column: 0, rowSpan: 1, columnSpan: 12 },
          configuration: {
            configurationType: WidgetConfigurationType.NOTES,
          },
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          universalIdentifier: `universal-widget-notes-${objectMetadataItem.id}`,
          applicationId,
          conditionalDisplay: null,
          position: {
            index: 0,
            layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
          },
              isActive: true,
          conditionalAvailabilityExpression: null,
          isSystemSideEffect: true,
        },
      ],
    });
  }

  if (fieldNames.has('attachments')) {
    const tabId = `fallback-tab-files-${objectMetadataItem.id}`;
    tabs.push({
      id: tabId,
      title: 'Files',
      position: 50,
      pageLayoutId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      universalIdentifier: `universal-tab-files-${objectMetadataItem.id}`,
      applicationId,
      icon: 'IconFiles',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      isActive: true,
      isSystemSideEffect: true,
      widgets: [
        {
          id: `fallback-widget-files-${objectMetadataItem.id}`,
          pageLayoutTabId: tabId,
          title: 'Files',
          type: WidgetType.FILES,
          objectMetadataId: objectMetadataItem.id,
          gridPosition: { row: 0, column: 0, rowSpan: 1, columnSpan: 12 },
          configuration: {
            configurationType: WidgetConfigurationType.FILES,
          },
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
          universalIdentifier: `universal-widget-files-${objectMetadataItem.id}`,
          applicationId,
          conditionalDisplay: null,
          position: {
            index: 0,
            layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
          },
              isActive: true,
          conditionalAvailabilityExpression: null,
          isSystemSideEffect: true,
        },
      ],
    });
  }

  return {
    id: pageLayoutId,
    name: `Default ${objectMetadataItem.labelSingular} Layout`,
    type: PageLayoutType.RECORD_PAGE,
    objectMetadataId: objectMetadataItem.id,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    universalIdentifier: `universal-layout-${objectMetadataItem.id}`,
    applicationId,
    defaultTabToFocusOnMobileAndSidePanelId: null,
    isSystemSideEffect: true,
    isFirstTabPinned: true,
    tabs,
  };
};
