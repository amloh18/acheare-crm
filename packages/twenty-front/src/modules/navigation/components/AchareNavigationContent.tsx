import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import {
  AchareModuleKey,
  isAchareModuleEnabled,
  AchareFeatureKey,
} from 'twenty-shared/workspace';
import {
  IconBell,
  IconBriefcase,
  IconBuildingSkyscraper,
  IconCalendar,
  IconCalendarEvent,
  IconChartBar,
  IconCheckbox,
  IconClock,
  IconCoins,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHierarchy,
  IconInbox,
  IconNotes,
  IconSettingsAutomation,
  IconTargetArrow,
  IconTrophy,
  IconUsers,
  useIcons,
  type IconComponent,
} from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { getObjectColorWithFallback } from '@/object-metadata/utils/getObjectColorWithFallback';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { AnimatedExpandableContainer } from 'twenty-ui/layout';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';

type NavItemConfig = {
  label: string;
  path: string;
  /**
   * Fallback icon, used when the object metadata is not available. When
   * `objectNamePlural` resolves, the object's own metadata icon and color are
   * shown instead, matching the rest of the twenty sidebar.
   */
  Icon: IconComponent;
  objectNamePlural?: string;
  overrideIcon?: boolean;
  featureKey?: AchareFeatureKey;
};

type NavModuleConfig = {
  key: AchareModuleKey | 'WORK';
  title: string;
  items: NavItemConfig[];
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: 0 0 ${themeCssVariables.spacing[4]} 0;
  width: 100%;
  box-sizing: border-box;
`;

const StyledModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.betweenSiblingsGap};
  padding-top: ${themeCssVariables.betweenSiblingsGap};
`;

type ModuleSectionProps = {
  module: NavModuleConfig;
  isDrawerExpanded: boolean;
  isItemActive: (item: NavItemConfig) => boolean;
  resolveItemObjectMetadata: (
    item: NavItemConfig,
  ) => ReturnType<typeof useFilteredObjectMetadataItems>['findObjectMetadataItemByNamePlural'] extends (
    ...args: any[]
  ) => infer R
    ? R
    : undefined;
  getIcon: (iconKey: string | null | undefined) => IconComponent;
  navigate: (path: string) => void;
  isMobile: boolean;
};

const ModuleSection = ({
  module,
  isDrawerExpanded,
  isItemActive,
  resolveItemObjectMetadata,
  getIcon,
  navigate,
  isMobile,
}: ModuleSectionProps) => {
  const { toggleNavigationSection, isNavigationSectionOpen } =
    useNavigationSection(`home/${module.key}`);

  const isOpen = isDrawerExpanded ? isNavigationSectionOpen : true;

  return (
    <NavigationDrawerSection>
      {isDrawerExpanded && (
        <NavigationDrawerSectionTitle
          label={module.title}
          onClick={toggleNavigationSection}
          isOpen={isNavigationSectionOpen}
        />
      )}
      <AnimatedExpandableContainer
        isExpanded={isOpen}
        dimension="height"
        mode="fit-content"
        containAnimation
        initial={false}
      >
        <StyledModuleList>
          {module.items.map((item) => {
            const objectMetadataItem = resolveItemObjectMetadata(item);
            const Icon =
              item.overrideIcon || !isDefined(objectMetadataItem)
                ? item.Icon
                : getIcon(objectMetadataItem.icon);
            const iconColor = isDefined(objectMetadataItem)
              ? getObjectColorWithFallback(objectMetadataItem)
              : undefined;

            return (
              <NavigationDrawerItem
                key={item.path}
                label={item.label}
                Icon={Icon}
                iconColor={iconColor}
                active={isItemActive(item)}
                onClick={() => navigate(item.path)}
                triggerEvent="CLICK"
                preventCollapseOnMobile={isMobile}
                indentationLevel={isDrawerExpanded ? 1 : undefined}
              />
            );
          })}
        </StyledModuleList>
      </AnimatedExpandableContainer>
    </NavigationDrawerSection>
  );
};

export const AchareNavigationContent = () => {
  const { t } = useLingui();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isDrawerExpanded = useIsNavigationDrawerContentExpanded();
  const enabledFeatures = useAchareEnabledFeatures();
  const { findObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();
  const { getIcon } = useIcons();

  const isModuleActive = (
    moduleKey: AchareModuleKey | 'WORK',
  ) => {
    if (moduleKey === 'WORK') {
      return true;
    }
    if (!enabledFeatures) {
      return true;
    }
    if (moduleKey === AchareModuleKey.HR) {
      return (
        isAchareModuleEnabled(
          enabledFeatures as AchareFeatureKey[],
          AchareModuleKey.HR,
        ) ||
        isAchareModuleEnabled(
          enabledFeatures as AchareFeatureKey[],
          AchareModuleKey.TEAM,
        )
      );
    }
    return isAchareModuleEnabled(
      enabledFeatures as AchareFeatureKey[],
      moduleKey,
    );
  };

  const modules: NavModuleConfig[] = [
    {
      key: 'WORK',
      title: t`Work`,
      items: [
        {
          label: t`Tasks`,
          path: '/objects/tasks',
          Icon: IconCheckbox,
          objectNamePlural: 'tasks',
          featureKey: AchareFeatureKey.TASKS,
        },
        {
          label: t`Documents`,
          path: '/objects/attachments',
          Icon: IconFile,
          objectNamePlural: 'attachments',
          overrideIcon: true,
          featureKey: AchareFeatureKey.DOCUMENTS,
        },
        {
          label: t`Notes`,
          path: '/objects/notes',
          Icon: IconNotes,
          objectNamePlural: 'notes',
          featureKey: AchareFeatureKey.NOTES,
        },
        {
          label: t`Workflows`,
          path: '/workflow-core',
          Icon: IconSettingsAutomation,
        },
      ],
    },
    {
      key: AchareModuleKey.CRM,
      title: t`Recruitment`,
      items: [
        {
          label: t`Companies`,
          path: '/objects/companies',
          Icon: IconBuildingSkyscraper,
          objectNamePlural: 'companies',
          featureKey: AchareFeatureKey.COMPANIES,
        },
        {
          label: t`People`,
          path: '/objects/people',
          Icon: IconUsers,
          objectNamePlural: 'people',
          featureKey: AchareFeatureKey.CONTACTS,
        },
        {
          label: t`Opportunities`,
          path: '/objects/opportunities',
          Icon: IconTargetArrow,
          objectNamePlural: 'opportunities',
          featureKey: AchareFeatureKey.OPPORTUNITIES,
        },
        {
          label: t`Jobs`,
          path: '/objects/requirements',
          Icon: IconBriefcase,
          objectNamePlural: 'requirements',
          featureKey: AchareFeatureKey.REQUIREMENTS,
        },
        {
          label: t`Applications`,
          path: '/objects/candidateSubmissions',
          Icon: IconInbox,
          objectNamePlural: 'candidateSubmissions',
          featureKey: AchareFeatureKey.SUBMISSIONS,
        },
        {
          label: t`Interviews`,
          path: '/objects/interviews',
          Icon: IconCalendarEvent,
          objectNamePlural: 'interviews',
          featureKey: AchareFeatureKey.INTERVIEWS,
        },
        {
          label: t`Placements`,
          path: '/objects/placements',
          Icon: IconTrophy,
          objectNamePlural: 'placements',
          featureKey: AchareFeatureKey.PLACEMENTS,
        },
      ],
    },
    {
      key: AchareModuleKey.HR,
      title: t`HR`,
      items: [
        {
          label: t`Attendance & Leave`,
          path: '/attendance-leave',
          Icon: IconClock,
          featureKey: AchareFeatureKey.ATTENDANCE,
        },
        {
          label: t`My Payslips`,
          path: '/my-payslips',
          Icon: IconCreditCard,
          featureKey: AchareFeatureKey.PAYSLIPS,
        },
        {
          label: t`My Documents`,
          path: '/my-documents',
          Icon: IconFile,
          featureKey: AchareFeatureKey.DOCUMENTS,
        },
        {
          label: t`Announcements`,
          path: '/announcements',
          Icon: IconBell,
          featureKey: AchareFeatureKey.ANNOUNCEMENTS,
        },
        {
          label: t`Departments`,
          path: '/objects/departments',
          Icon: IconHierarchy,
          objectNamePlural: 'departments',
          featureKey: AchareFeatureKey.DEPARTMENTS,
        },
      ],
    },
    {
      key: AchareModuleKey.PAYROLL,
      title: t`Payroll`,
      items: [
        {
          label: t`Payroll Runs`,
          path: '/objects/payrollPeriods',
          Icon: IconCreditCard,
          objectNamePlural: 'payrollPeriods',
          featureKey: AchareFeatureKey.PAYROLL,
        },
        {
          label: t`Payslips`,
          path: '/objects/payslips',
          Icon: IconFileText,
          objectNamePlural: 'payslips',
          featureKey: AchareFeatureKey.PAYSLIPS,
        },
        {
          label: t`Salary Structures`,
          path: '/objects/salaryStructures',
          Icon: IconCoins,
          objectNamePlural: 'salaryStructures',
          featureKey: AchareFeatureKey.SALARY,
        },
      ],
    },
  ];

  const isItemVisible = (item: NavItemConfig) => {
    if (!item.featureKey || !enabledFeatures) {
      return true;
    }
    return enabledFeatures.includes(item.featureKey);
  };

  const visibleModules = modules
    .map((mod) => ({
      ...mod,
      items: mod.items.filter(isItemVisible),
    }))
    .filter((mod) => isModuleActive(mod.key) && mod.items.length > 0);

  const currentPath = location.pathname;

  const isDashboardActive =
    currentPath === AppPath.Dashboard ||
    currentPath === '/' ||
    currentPath === AppPath.Index;

  // Same rule as the twenty sidebar: the current object owns the highlight on
  // both its index page (/objects/:objectNamePlural) and its record pages
  // (/object/:objectNameSingular/:objectRecordId), so the active page is
  // highlighted exactly once.
  const activeIndexObjectNamePlural = matchPath(
    AppPath.RecordIndexPage,
    currentPath,
  )?.params.objectNamePlural;
  const activeShowObjectNameSingular = matchPath(
    AppPath.RecordShowPage,
    currentPath,
  )?.params.objectNameSingular;

  const resolveItemObjectMetadata = (item: NavItemConfig) =>
    isDefined(item.objectNamePlural)
      ? findObjectMetadataItemByNamePlural(item.objectNamePlural)
      : undefined;

  const isItemActive = (item: NavItemConfig) => {
    const objectMetadataItem = resolveItemObjectMetadata(item);

    if (isDefined(objectMetadataItem)) {
      return (
        activeIndexObjectNamePlural === objectMetadataItem.namePlural ||
        activeShowObjectNameSingular === objectMetadataItem.nameSingular
      );
    }

    if (item.path === AppPath.Dashboard) {
      return isDashboardActive;
    }

    return (
      currentPath === item.path ||
      (currentPath.startsWith(item.path) &&
        (currentPath.length === item.path.length ||
          currentPath.charAt(item.path.length) === '/'))
    );
  };

  return (
    <NavigationDrawerSection>
      <StyledContainer>
        {/* Dashboard link */}
        <NavigationDrawerItem
          label={t`Dashboard`}
          Icon={IconChartBar}
          active={isDashboardActive}
          onClick={() => navigate(AppPath.Dashboard)}
          triggerEvent="CLICK"
          preventCollapseOnMobile={isMobile}
        />

        {/* Product Modules */}
        {visibleModules.map((module) => (
          <ModuleSection
            key={module.key}
            module={module}
            isDrawerExpanded={isDrawerExpanded}
            isItemActive={isItemActive}
            resolveItemObjectMetadata={resolveItemObjectMetadata}
            getIcon={getIcon}
            navigate={navigate}
            isMobile={isMobile}
          />
        ))}
      </StyledContainer>
    </NavigationDrawerSection>
  );
};
