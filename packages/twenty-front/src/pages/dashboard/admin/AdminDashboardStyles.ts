import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
`;

export const StyledCardTitle = styled.h3`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.secondary};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StyledKpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${themeCssVariables.spacing[4]};
`;

export const StyledKpiCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

export const StyledKpiLabel = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StyledKpiValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

export const StyledKpiChange = styled.span<{ isPositive?: boolean }>`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${({ isPositive }) =>
    isPositive === false
      ? themeCssVariables.font.color.danger
      : themeCssVariables.color.green};
`;

export const StyledTwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${themeCssVariables.spacing[4]};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledThreeColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${themeCssVariables.spacing[4]};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

export const StyledBarLabel = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
  min-width: 120px;
  flex-shrink: 0;
`;

export const StyledBarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: ${themeCssVariables.background.secondary};
  border-radius: 4px;
  overflow: hidden;
`;

export const StyledBarFill = styled.div<{ width: number; color?: string }>`
  height: 100%;
  width: ${({ width }) => Math.min(width, 100)}%;
  background: ${({ color }) => color ?? themeCssVariables.color.blue};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const StyledBarValue = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
  min-width: 60px;
  text-align: right;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const StyledTh = styled.th`
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.tertiary};
  text-align: left;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StyledTd = styled.td`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

export const StyledBadge = styled.span<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: 2px 8px;
  border-radius: 12px;
  background: ${({ color }) =>
    color ?? themeCssVariables.background.transparent.lighter};
  color: ${({ color }) =>
    color ? 'white' : themeCssVariables.font.color.secondary};
`;

export const StyledAlertCard = styled.div<{ severity: 'info' | 'warning' | 'success' | 'danger' }>`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[4]};
  border-radius: ${themeCssVariables.border.radius.md};
  border-left: 3px solid
    ${({ severity }) => {
      switch (severity) {
        case 'danger':
          return themeCssVariables.color.red;
        case 'warning':
          return themeCssVariables.color.orange;
        case 'success':
          return themeCssVariables.color.green;
        default:
          return themeCssVariables.color.blue;
      }
    }};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
`;

export const StyledAlertTitle = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.primary};
`;

export const StyledAlertBody = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
  line-height: 1.5;
`;

export const StyledFunnelStep = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

export const StyledFunnelBar = styled.div<{ width: number }>`
  height: 24px;
  width: ${({ width }) => Math.min(width, 100)}%;
  background: ${themeCssVariables.color.blue};
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 ${themeCssVariables.spacing[2]};
  transition: width 0.3s ease;
`;

export const StyledFunnelLabel = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: white;
  font-weight: ${themeCssVariables.font.weight.medium};
  white-space: nowrap;
`;

export const StyledFunnelValue = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
  min-width: 60px;
`;

export const StyledFunnelRate = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  min-width: 50px;
`;

export const StyledSectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${themeCssVariables.spacing[4]};
`;

export const StyledMiniChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 40px;
`;

export const StyledMiniBar = styled.div<{ height: number; color?: string }>`
  flex: 1;
  height: ${({ height }) => Math.max(height, 2)}px;
  background: ${({ color }) => color ?? themeCssVariables.color.blue};
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
`;

export const StyledMetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${themeCssVariables.spacing[2]} 0;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};

  &:last-child {
    border-bottom: none;
  }
`;

export const StyledMetricLabel = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
`;

export const StyledMetricValue = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
`;

export const StyledProgressBar = styled.div`
  display: flex;
  height: 8px;
  background: ${themeCssVariables.background.secondary};
  border-radius: 4px;
  overflow: hidden;
  margin: ${themeCssVariables.spacing[2]} 0;
`;

export const StyledProgressSegment = styled.div<{ width: number; color: string }>`
  width: ${({ width }) => width}%;
  background: ${({ color }) => color};
  transition: width 0.3s ease;
`;

export const StyledProgressLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[3]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const StyledLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.secondary};
`;

export const StyledLegendDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;
