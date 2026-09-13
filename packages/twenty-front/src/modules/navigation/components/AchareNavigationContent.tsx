import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppPath } from 'twenty-shared/types';
import {
  AchareModuleKey,
  isAchareModuleEnabled,
  type AchareFeatureKey,
} from 'twenty-shared/workspace';
import {
  IconBriefcase,
  IconBuildingSkyscraper,
  IconCalendar,
  IconCalendarEvent,
  IconChartBar,
  IconChartPie,
  IconCheckbox,
  IconChevronDown,
  IconChevronRight,
  IconClock,
  IconCoins,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHierarchy,
  IconHome,
  IconInbox,
  IconSettingsAutomation,
  IconTargetArrow,
  IconUser,
  IconUsers,
  IconUserPlus,
  type IconComponent,
} from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { AnimatedExpandableContainer } from 'twenty-ui/layout';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';

type NavItemConfig = {
  label: string;
  path: string;
  Icon: IconComponent;
};

type NavModuleConfig = {
  key: AchareModuleKey | 'WORK' | 'REPORTS';
  title: string;
  items: NavItemConfig[];
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: 0 ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]}
    ${themeCssVariables.spacing[2]};
  width: 100%;
  box-sizing: border-box;
`;

const StyledSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[1]};
  cursor: pointer;
  user-select: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledSectionTitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const StyledModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.betweenSiblingsGap};
  padding-top: ${themeCssVariables.betweenSiblingsGap};
`;

export const AchareNavigationContent = () => {
  const { t } = useLingui();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isDrawerExpanded = useIsNavigationDrawerContentExpanded();
  const enabledFeatures = useAchareEnabledFeatures();

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const isModuleActive = (moduleKey: AchareModuleKey | 'WORK' | 'REPORTS') => {
    if (moduleKey === 'WORK' || moduleKey === 'REPORTS') {
      return true;
    }
    if (!enabledFeatures) {
      return true;
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
          label: t`Dashboard`,
          path: AppPath.Dashboard,
          Icon: IconChartBar,
        },
        {
          label: t`Tasks`,
          path: '/objects/tasks',
          Icon: IconCheckbox,
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
      title: t`CRM`,
      items: [
        {
          label: t`Companies`,
          path: '/objects/companies',
          Icon: IconBuildingSkyscraper,
        },
        {
          label: t`People`,
          path: '/objects/people?context=CONTACT',
          Icon: IconUser,
        },
        {
          label: t`Opportunities`,
          path: '/objects/opportunities',
          Icon: IconTargetArrow,
        },
      ],
    },
    {
      key: AchareModuleKey.RECRUITMENT,
      title: t`Recruitment`,
      items: [
        {
          label: t`Jobs`,
          path: '/objects/requirements',
          Icon: IconBriefcase,
        },
        {
          label: t`Applications`,
          path: '/objects/candidateSubmissions',
          Icon: IconInbox,
        },
        {
          label: t`Interviews`,
          path: '/objects/interviews',
          Icon: IconCalendarEvent,
        },
      ],
    },
    {
      key: AchareModuleKey.TEAM,
      title: t`People`,
      items: [
        {
          label: t`All People`,
          path: '/objects/people',
          Icon: IconUsers,
        },
        {
          label: t`Team`,
          path: '/objects/people?context=IN_HOUSE',
          Icon: IconUsers,
        },
        {
          label: t`Candidates`,
          path: '/objects/people?context=CANDIDATE',
          Icon: IconUserPlus,
        },
        {
          label: t`Contacts`,
          path: '/objects/people?context=CONTACT',
          Icon: IconBuildingSkyscraper,
        },
        {
          label: t`Attendance`,
          path: '/objects/attendanceDays',
          Icon: IconClock,
        },
        {
          label: t`Leave`,
          path: '/objects/leaveRequests',
          Icon: IconCalendar,
        },
        {
          label: t`Departments`,
          path: '/objects/departments',
          Icon: IconHierarchy,
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
        },
        {
          label: t`Payslips`,
          path: '/objects/payslips',
          Icon: IconFileText,
        },
        {
          label: t`Salary Structures`,
          path: '/objects/salaryStructures',
          Icon: IconCoins,
        },
      ],
    },
    {
      key: AchareModuleKey.DOCUMENTS,
      title: t`Documents`,
      items: [
        {
          label: t`Documents`,
          path: '/objects/notes',
          Icon: IconFile,
        },
      ],
    },
    {
      key: 'REPORTS',
      title: t`Reports`,
      items: [
        {
          label: t`Dashboards`,
          path: '/objects/dashboards',
          Icon: IconChartPie,
        },
      ],
    },
  ];

  const visibleModules = modules.filter((mod) => isModuleActive(mod.key));

  return (
    <StyledContainer>
      {/* Home link */}
      <NavigationDrawerItem
        label={t`Home`}
        Icon={IconHome}
        active={
          location.pathname === AppPath.Home || location.pathname === '/'
        }
        onClick={() => navigate(AppPath.Home)}
        triggerEvent="CLICK"
        preventCollapseOnMobile={isMobile}
      />

      {/* Product Modules */}
      {visibleModules.map((module) => {
        const isCollapsed = Boolean(collapsedSections[module.key]);
        const hasActiveChild = module.items.some((item) =>
          location.pathname.startsWith(item.path),
        );

        return (
          <div key={module.key}>
            {isDrawerExpanded && (
              <NavigationDrawerAnimatedCollapseWrapper>
                <StyledSectionHeader
                  onClick={() => toggleSection(module.key)}
                  role="button"
                  tabIndex={0}
                >
                  <StyledSectionTitle>{module.title}</StyledSectionTitle>
                  {isCollapsed ? (
                    <IconChevronRight size={12} />
                  ) : (
                    <IconChevronDown size={12} />
                  )}
                </StyledSectionHeader>
              </NavigationDrawerAnimatedCollapseWrapper>
            )}

            <AnimatedExpandableContainer
              isExpanded={!isCollapsed || !isDrawerExpanded}
              dimension="height"
              mode="fit-content"
              containAnimation
              initial={false}
            >
              <StyledModuleList>
                {module.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);

                  return (
                    <NavigationDrawerItem
                      key={item.path}
                      label={item.label}
                      Icon={item.Icon}
                      active={isActive}
                      onClick={() => navigate(item.path)}
                      triggerEvent="CLICK"
                      preventCollapseOnMobile={isMobile}
                      indentationLevel={isDrawerExpanded ? 1 : undefined}
                    />
                  );
                })}
              </StyledModuleList>
            </AnimatedExpandableContainer>
          </div>
        );
      })}
    </StyledContainer>
  );
};
