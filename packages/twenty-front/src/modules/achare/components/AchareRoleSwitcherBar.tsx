import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useAchareRole } from '../hooks/useAchareRole';
import { AchareRole } from '../types/achareRole';
import {
  IconUserCircle,
  IconBriefcase,
  IconTargetArrow,
  IconUsers,
  IconUser,
  type IconComponent,
} from 'twenty-ui/icon';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  margin-bottom: ${themeCssVariables.spacing[4]};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledBrandTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  padding: 4px 10px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-weight: 600;
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledRoleDesc = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

const StyledPills = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 3px;
  border-radius: ${themeCssVariables.border.radius.sm};
  overflow-x: auto;
`;

const StyledPill = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 4px;
  border: none;
  font-size: 0.8125rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.background.tertiary : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
    background: ${({ isActive }) =>
      isActive
        ? themeCssVariables.background.tertiary
        : themeCssVariables.background.transparent.lighter};
  }
`;

const ROLE_ICONS: Record<AchareRole, IconComponent> = {
  admin: IconUserCircle,
  recruiter: IconBriefcase,
  bde: IconTargetArrow,
  hr: IconUsers,
  employee: IconUser,
};

export const AchareRoleSwitcherBar = () => {
  const { role, setRole, roleConfig, allRoles } = useAchareRole();

  return (
    <StyledContainer>
      <StyledLeft>
        <StyledBrandTag>
          <span>Achare OS</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ color: themeCssVariables.font.color.secondary }}>
            {roleConfig.label}
          </span>
        </StyledBrandTag>
        <StyledRoleDesc>{roleConfig.description}</StyledRoleDesc>
      </StyledLeft>

      <StyledPills>
        {allRoles.map((r) => {
          const Icon = ROLE_ICONS[r.id];
          const isActive = role === r.id;
          return (
            <StyledPill
              key={r.id}
              isActive={isActive}
              onClick={() => setRole(r.id)}
              title={r.description}
            >
              <Icon size={14} />
              <span>{r.badge}</span>
            </StyledPill>
          );
        })}
      </StyledPills>
    </StyledContainer>
  );
};
