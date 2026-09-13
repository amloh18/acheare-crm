import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { type IconComponent } from 'twenty-ui/icon';

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StyledIconWrap = styled.div<{ colorTone?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  line-height: 1.2;
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledDelta = styled.span<{ isPositive?: boolean }>`
  font-weight: 600;
  color: ${({ isPositive }) => (isPositive ? '#10b981' : '#ef4444')};
`;

interface KPIWidgetProps {
  title: string;
  value: string | number;
  Icon: IconComponent;
  subtext?: string;
  delta?: string;
  isPositive?: boolean;
}

export const KPIWidget = ({
  title,
  value,
  Icon,
  subtext,
  delta,
  isPositive = true,
}: KPIWidgetProps) => {
  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitle>{title}</StyledTitle>
        <StyledIconWrap>
          <Icon size={18} />
        </StyledIconWrap>
      </StyledHeader>
      <StyledValue>{value}</StyledValue>
      {(delta || subtext) && (
        <StyledFooter>
          {delta && <StyledDelta isPositive={isPositive}>{delta}</StyledDelta>}
          {subtext && <span>{subtext}</span>}
        </StyledFooter>
      )}
    </StyledCard>
  );
};
