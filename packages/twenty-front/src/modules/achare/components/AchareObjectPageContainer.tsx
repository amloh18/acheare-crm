import { ReactNode, useState, useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconLayoutKanban,
  IconTable,
  IconBriefcase,
  IconUsers,
  IconClock,
  IconCreditCard,
  IconFileText,
  type IconComponent,
} from 'twenty-ui/icon';

import { CandidatePipelineView } from '../views/CandidatePipelineView';
import { JobsCardView } from '../views/JobsCardView';
import { EmployeeDirectoryView } from '../views/EmployeeDirectoryView';
import { AttendanceDashboardView } from '../views/AttendanceDashboardView';
import { PayrollRunView } from '../views/PayrollRunView';
import { DocumentCenterView } from '../views/DocumentCenterView';
import { UnifiedPeopleDirectoryView } from '../views/UnifiedPeopleDirectoryView';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const StyledTabBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${themeCssVariables.background.secondary};
  padding: 3px;
  border-radius: ${themeCssVariables.border.radius.sm};
  border: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTabButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  border: none;
  font-size: 0.8125rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.background.primary : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${({ isActive }) =>
    isActive ? '0 1px 3px rgba(0, 0, 0, 0.06)' : 'none'};

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[4]};
`;

interface AchareObjectPageContainerProps {
  objectNameSingular: string;
  children: ReactNode;
}

interface CustomViewDef {
  label: string;
  Icon: IconComponent;
  component: ReactNode;
}

export const AchareObjectPageContainer = ({
  objectNameSingular,
  children,
}: AchareObjectPageContainerProps) => {
  const [viewMode, setViewMode] = useState<'custom' | 'data'>('custom');

  const customViewConfig: CustomViewDef | null = useMemo(() => {
    switch (objectNameSingular) {
      case 'person':
        return {
          label: 'People Directory',
          Icon: IconUsers,
          component: <UnifiedPeopleDirectoryView />,
        };
      case 'employee':
        return {
          label: 'Team Directory',
          Icon: IconUsers,
          component: <UnifiedPeopleDirectoryView defaultContext="IN_HOUSE" />,
        };
      case 'candidate':
        return {
          label: 'Candidates',
          Icon: IconUsers,
          component: <UnifiedPeopleDirectoryView defaultContext="CANDIDATE" />,
        };
      case 'candidateSubmission':
        return {
          label: 'Applications Pipeline',
          Icon: IconLayoutKanban,
          component: <CandidatePipelineView />,
        };
      case 'requirement':
        return {
          label: 'Job Openings',
          Icon: IconBriefcase,
          component: <JobsCardView />,
        };
      case 'attendanceDay':
        return {
          label: 'Attendance Ops',
          Icon: IconClock,
          component: <AttendanceDashboardView />,
        };
      case 'payrollPeriod':
      case 'payslip':
        return {
          label: 'Payroll Hub',
          Icon: IconCreditCard,
          component: <PayrollRunView />,
        };
      case 'note':
        return {
          label: 'Document Center',
          Icon: IconFileText,
          component: <DocumentCenterView />,
        };
      default:
        return null;
    }
  }, [objectNameSingular]);

  // If this object does not have a specialized Achare presentation, render standard view
  if (!customViewConfig) {
    return <>{children}</>;
  }

  const CustomIcon = customViewConfig.Icon;

  return (
    <StyledWrapper>
      <StyledTabBar>
        <StyledTabGroup>
          <StyledTabButton
            isActive={viewMode === 'custom'}
            onClick={() => setViewMode('custom')}
          >
            <CustomIcon size={14} />
            <span>{customViewConfig.label}</span>
          </StyledTabButton>
          <StyledTabButton
            isActive={viewMode === 'data'}
            onClick={() => setViewMode('data')}
          >
            <IconTable size={14} />
            <span>Data View</span>
          </StyledTabButton>
        </StyledTabGroup>

        <span
          style={{
            fontSize: '0.75rem',
            color: themeCssVariables.font.color.tertiary,
          }}
        >
          Achare Business OS
        </span>
      </StyledTabBar>

      {viewMode === 'custom' ? (
        <StyledContentArea>{customViewConfig.component}</StyledContentArea>
      ) : (
        children
      )}
    </StyledWrapper>
  );
};
