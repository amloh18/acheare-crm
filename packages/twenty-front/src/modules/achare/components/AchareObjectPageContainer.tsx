import { ReactNode, useState } from 'react';
import { styled } from '@linaria/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconTable,
  IconHierarchy,
  IconLayoutKanban,
  IconUsers,
  IconUser,
  IconUserPlus,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconInbox,
} from 'twenty-ui/icon';

import { CandidatePipelineView } from '../views/CandidatePipelineView';
import { OrgChartView } from '../views/OrgChartView';
import { useUnifiedPeople } from '../hooks/useUnifiedPeople';
import { UnifiedPerson } from '../types/acharePeople';
import { PersonProfileModal } from '../components/PersonProfileModal';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;

const StyledChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
`;

const StyledContextBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  gap: ${themeCssVariables.spacing[2]};
  flex-shrink: 0;
`;

const StyledTabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
`;

const StyledContextTab = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${themeCssVariables.border.radius.sm};
  border: 1px solid
    ${({ isActive }) =>
      isActive ? themeCssVariables.border.color.medium : 'transparent'};
  font-size: 0.8125rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.background.secondary : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
    background: ${({ isActive }) =>
      isActive
        ? themeCssVariables.background.secondary
        : themeCssVariables.background.transparent.lighter};
  }
`;

const StyledViewSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: ${themeCssVariables.background.secondary};
  padding: 2px;
  border-radius: ${themeCssVariables.border.radius.sm};
  border: 1px solid ${themeCssVariables.border.color.light};
  flex-shrink: 0;
`;

const StyledViewButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 4px;
  border: none;
  font-size: 0.75rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.background.primary : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  box-shadow: ${({ isActive }) =>
    isActive ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.15s ease;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledContentArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledContextTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

interface AchareObjectPageContainerProps {
  objectNameSingular: string;
  children: ReactNode;
}

const PEOPLE_CONTEXT_TABS = [
  {
    key: 'ALL',
    label: 'All People',
    Icon: IconUsers,
    path: '/objects/people',
  },
  {
    key: 'TEAM',
    label: 'Team',
    Icon: IconUser,
    path: '/objects/people?filter[inHouse][is]=true',
  },
  {
    key: 'CANDIDATE',
    label: 'Candidates',
    Icon: IconUserPlus,
    path: '/objects/people?filter[contexts][contains]=["CANDIDATE"]',
  },
  {
    key: 'CONTACT',
    label: 'Contacts',
    Icon: IconBuildingSkyscraper,
    path: '/objects/people?filter[contexts][contains]=["CONTACT"]',
  },
  {
    key: 'CONTRACTOR',
    label: 'Contractors',
    Icon: IconBriefcase,
    path: '/objects/people?filter[contexts][contains]=["CONTRACTOR"]',
  },
] as const;

export const AchareObjectPageContainer = ({
  objectNameSingular,
  children,
}: AchareObjectPageContainerProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [peopleViewMode, setPeopleViewMode] = useState<'table' | 'orgChart'>(
    'table',
  );
  const [pipelineViewMode, setPipelineViewMode] = useState<'table' | 'board'>(
    'table',
  );
  const [selectedPerson, setSelectedPerson] = useState<UnifiedPerson | null>(
    null,
  );

  const { people } = useUnifiedPeople();

  // All standard modules (Jobs, Companies, Opportunities, Attendance, Leave, Departments, Payroll, Documents, Tasks)
  // use the native Data View directly with zero intervention.
  if (
    objectNameSingular !== 'person' &&
    objectNameSingular !== 'candidateSubmission'
  ) {
    return <>{children}</>;
  }

  // Applications (candidateSubmission) - Data View by default, with optional Pipeline Board switch
  if (objectNameSingular === 'candidateSubmission') {
    return (
      <StyledWrapper>
        <StyledContextBar>
          <StyledContextTitle>
            <IconInbox size={16} />
            <span>Applications Pipeline</span>
          </StyledContextTitle>

          <StyledViewSwitcher>
            <StyledViewButton
              isActive={pipelineViewMode === 'table'}
              onClick={() => setPipelineViewMode('table')}
            >
              <IconTable size={13} />
              <span>Table</span>
            </StyledViewButton>
            <StyledViewButton
              isActive={pipelineViewMode === 'board'}
              onClick={() => setPipelineViewMode('board')}
            >
              <IconLayoutKanban size={13} />
              <span>Pipeline Board</span>
            </StyledViewButton>
          </StyledViewSwitcher>
        </StyledContextBar>

        {pipelineViewMode === 'table' ? (
          <StyledChildContainer>{children}</StyledChildContainer>
        ) : (
          <StyledContentArea>
            <CandidatePipelineView />
          </StyledContentArea>
        )}
      </StyledWrapper>
    );
  }

  // People master directory - Data View by default with saved context filter tabs and optional Org Chart switch
  const isPeopleTabActive = (tabKey: string) => {
    const search = decodeURIComponent(location.search);
    switch (tabKey) {
      case 'TEAM':
        return search.includes('inHouse');
      case 'CANDIDATE':
        return search.includes('contexts') && search.includes('CANDIDATE');
      case 'CONTACT':
        return search.includes('contexts') && search.includes('CONTACT');
      case 'CONTRACTOR':
        return search.includes('contexts') && search.includes('CONTRACTOR');
      case 'ALL':
      default:
        return (
          !search.includes('inHouse') &&
          !search.includes('CANDIDATE') &&
          !search.includes('CONTACT') &&
          !search.includes('CONTRACTOR')
        );
    }
  };

  return (
    <StyledWrapper>
      <StyledContextBar>
        <StyledTabGroup>
          {PEOPLE_CONTEXT_TABS.map((tab) => {
            const TabIcon = tab.Icon;
            const isActive = isPeopleTabActive(tab.key);

            return (
              <StyledContextTab
                key={tab.key}
                isActive={isActive}
                onClick={() => navigate(tab.path)}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
              </StyledContextTab>
            );
          })}
        </StyledTabGroup>

        <StyledViewSwitcher>
          <StyledViewButton
            isActive={peopleViewMode === 'table'}
            onClick={() => setPeopleViewMode('table')}
          >
            <IconTable size={13} />
            <span>Table</span>
          </StyledViewButton>
          <StyledViewButton
            isActive={peopleViewMode === 'orgChart'}
            onClick={() => setPeopleViewMode('orgChart')}
          >
            <IconHierarchy size={13} />
            <span>Org Chart</span>
          </StyledViewButton>
        </StyledViewSwitcher>
      </StyledContextBar>

      {peopleViewMode === 'table' ? (
        <StyledChildContainer>{children}</StyledChildContainer>
      ) : (
        <StyledContentArea>
          <OrgChartView
            people={people}
            onSelectPerson={(p) => setSelectedPerson(p)}
          />
          <PersonProfileModal
            person={selectedPerson}
            isOpen={Boolean(selectedPerson)}
            onClose={() => setSelectedPerson(null)}
          />
        </StyledContentArea>
      )}
    </StyledWrapper>
  );
};
