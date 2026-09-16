import { styled } from '@linaria/react';
import { useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useLingui } from '@lingui/react/macro';
import {
  IconList,
  IconTrendingUp,
  IconBriefcase,
  IconUsers,
  IconUserCircle,
  IconBrain,
} from 'twenty-ui/icon';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminBusinessTab } from './AdminBusinessTab';
import { AdminHiringTab } from './AdminHiringTab';
import { AdminWorkforceTab } from './AdminWorkforceTab';
import { AdminPerformanceTab } from './AdminPerformanceTab';
import { AdminInsightsTab } from './AdminInsightsTab';

type TabId = 'overview' | 'business' | 'hiring' | 'workforce' | 'performance' | 'insights';

const TABS: Array<{ id: TabId; label: string; icon: typeof IconList }> = [
  { id: 'overview', label: 'Overview', icon: IconList },
  { id: 'business', label: 'Business', icon: IconTrendingUp },
  { id: 'hiring', label: 'Hiring', icon: IconBriefcase },
  { id: 'workforce', label: 'Workforce', icon: IconUsers },
  { id: 'performance', label: 'Performance', icon: IconUserCircle },
  { id: 'insights', label: 'Insights', icon: IconBrain },
];

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[5]};
  padding: ${themeCssVariables.spacing[6]};
  max-width: 1400px;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledGreeting = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledGreetingSub = styled.p`
  font-size: 0.875rem;
  color: ${themeCssVariables.font.color.secondary};
  margin: 0;
`;

const StyledTabBar = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding-bottom: 0;
`;

const StyledTab = styled.button<{ isActive: boolean }>`
  align-items: center;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ isActive }) =>
      isActive ? themeCssVariables.color.blue : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const AdminDashboard = () => {
  const { t } = useLingui();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const firstName =
    currentWorkspaceMember?.name?.firstName ||
    currentWorkspaceMember?.name?.lastName ||
    '';

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverviewTab />;
      case 'business':
        return <AdminBusinessTab />;
      case 'hiring':
        return <AdminHiringTab />;
      case 'workforce':
        return <AdminWorkforceTab />;
      case 'performance':
        return <AdminPerformanceTab />;
      case 'insights':
        return <AdminInsightsTab />;
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledGreeting>
          {getGreeting()}, {firstName}!
        </StyledGreeting>
        <StyledGreetingSub>
          {t`Here's your work overview for today.`}
        </StyledGreetingSub>
      </StyledHeader>

      <StyledTabBar>
        {TABS.map((tab) => (
          <StyledTab
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={14} />
            {tab.label}
          </StyledTab>
        ))}
      </StyledTabBar>

      {renderTab()}
    </StyledContainer>
  );
};
