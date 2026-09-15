import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight, IconCoins, IconCreditCard, IconDatabase, IconAlertTriangle } from 'twenty-ui/icon';

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledViewAll = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 0.8125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${themeCssVariables.spacing[6]};
  text-align: center;
  color: ${themeCssVariables.font.color.tertiary};
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledEmptyIcon = styled.div`
  opacity: 0.5;
`;

const StyledEmptyText = styled.span`
  font-size: 0.8125rem;
`;

const StyledContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledDataBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledDataLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
`;

const StyledDataValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledStatusBadge = styled.span<{ status?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  width: fit-content;
`;

interface PayrollSummaryWidgetProps {
  periodName?: string;
  totalNet?: string;
  employeeCount?: number;
  status?: string;
  payDate?: string;
  loading?: boolean;
  error?: boolean;
}

export const PayrollSummaryWidget = ({
  periodName = 'August 2026 Cycle',
  totalNet = '$148,650.00',
  employeeCount = 48,
  status = 'PAID',
  payDate = 'Aug 31, 2026',
  loading,
  error,
}: PayrollSummaryWidgetProps) => {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconCreditCard size={18} />
          <span>Payroll & Compensation</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/payrollPeriods')}>
          <span>Payroll Runs</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      {loading ? (
        <StyledEmptyState>
          <StyledEmptyText>Loading payroll data...</StyledEmptyText>
        </StyledEmptyState>
      ) : error ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconAlertTriangle size={20} /></StyledEmptyIcon>
          <StyledEmptyText>Unable to load payroll data</StyledEmptyText>
        </StyledEmptyState>
      ) : (
        <StyledContentGrid>
          <StyledDataBlock>
            <StyledDataLabel>Active Cycle</StyledDataLabel>
            <StyledDataValue>{periodName}</StyledDataValue>
            <StyledStatusBadge>{status}</StyledStatusBadge>
          </StyledDataBlock>

          <StyledDataBlock>
            <StyledDataLabel>Total Net Disbursed</StyledDataLabel>
            <StyledDataValue>{totalNet}</StyledDataValue>
            <span style={{ fontSize: '0.75rem', color: themeCssVariables.font.color.tertiary }}>
              Processed on {payDate}
            </span>
          </StyledDataBlock>

          <StyledDataBlock>
            <StyledDataLabel>Headcount Paid</StyledDataLabel>
            <StyledDataValue>{employeeCount} Employees</StyledDataValue>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
              100% On Time
            </span>
          </StyledDataBlock>
        </StyledContentGrid>
      )}
    </StyledCard>
  );
};
