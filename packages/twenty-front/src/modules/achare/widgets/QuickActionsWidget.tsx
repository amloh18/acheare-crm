import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import {
  IconPlus,
  IconBriefcase,
  IconUserPlus,
  IconTargetArrow,
  IconUsers,
  IconCalendar,
  IconCreditCard,
  type IconComponent,
} from 'twenty-ui/icon';
import { AchareRole } from '../types/achareRole';

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTitle = styled.div`
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: ${themeCssVariables.border.radius.sm};
  border: 1px solid ${themeCssVariables.border.color.medium};
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.primary};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.font.color.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
`;

interface ActionItem {
  label: string;
  path: string;
  Icon: IconComponent;
  roles?: AchareRole[];
}

const ALL_ACTIONS: ActionItem[] = [
  { label: 'Post Job', path: '/objects/requirements', Icon: IconBriefcase, roles: ['admin', 'recruiter'] },
  { label: 'Add Candidate', path: '/objects/candidates', Icon: IconUserPlus, roles: ['admin', 'recruiter'] },
  { label: 'New Deal', path: '/objects/opportunities', Icon: IconTargetArrow, roles: ['admin', 'bde'] },
  { label: 'Add Employee', path: '/objects/employees', Icon: IconUsers, roles: ['admin', 'hr'] },
  { label: 'Request Leave', path: '/attendance-leave', Icon: IconCalendar, roles: ['admin', 'hr', 'employee'] },
  { label: 'Process Payroll', path: '/objects/payrollPeriods', Icon: IconCreditCard, roles: ['admin', 'hr'] },
];

export const QuickActionsWidget = ({ role }: { role: AchareRole }) => {
  const navigate = useNavigate();

  const actions = ALL_ACTIONS.filter(
    (act) => !act.roles || act.roles.includes(role),
  );

  return (
    <StyledCard>
      <StyledTitle>Quick Operations & Workflows</StyledTitle>
      <StyledActionGrid>
        {actions.map((act) => {
          const Icon = act.Icon;
          return (
            <StyledActionButton key={act.label} onClick={() => navigate(act.path)}>
              <Icon size={16} />
              <span>{act.label}</span>
            </StyledActionButton>
          );
        })}
      </StyledActionGrid>
    </StyledCard>
  );
};
