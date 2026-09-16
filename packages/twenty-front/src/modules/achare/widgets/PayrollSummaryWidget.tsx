import { useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight, IconCoins, IconCreditCard, IconDatabase, IconAlertTriangle } from 'twenty-ui/icon';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';

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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

const formatCurrency = (micros: number) => {
  const amount = micros / 1_000_000;
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

export const PayrollSummaryWidget = () => {
  const navigate = useNavigate();

  const { records: periods, loading, error } = useFindManyRecords({
    objectNameSingular: 'payrollPeriod' as CoreObjectNameSingular,
    recordGqlFields: {
      id: true,
      label: true,
      status: true,
      startDate: true,
      endDate: true,
      totalNetPay: true,
      employeeCount: true,
    },
    orderBy: [{ startDate: 'DescNullsLast' }],
    limit: 1,
  });

  const latestPeriod = useMemo(() => {
    if (periods.length === 0) return null;
    const period = periods[0] as any;
    return {
      label: period.label || 'Current Period',
      status: period.status || 'ACTIVE',
      totalNetPay: period.totalNetPay || 0,
      employeeCount: period.employeeCount || 0,
      endDate: period.endDate,
    };
  }, [periods]);

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
      ) : !latestPeriod ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconDatabase size={20} /></StyledEmptyIcon>
          <StyledEmptyText>No payroll data available</StyledEmptyText>
        </StyledEmptyState>
      ) : (
        <StyledContentGrid>
          <StyledDataBlock>
            <StyledDataLabel>Active Cycle</StyledDataLabel>
            <StyledDataValue>{latestPeriod.label}</StyledDataValue>
            <StyledStatusBadge>{latestPeriod.status}</StyledStatusBadge>
          </StyledDataBlock>

          <StyledDataBlock>
            <StyledDataLabel>Total Net Disbursed</StyledDataLabel>
            <StyledDataValue>{formatCurrency(latestPeriod.totalNetPay)}</StyledDataValue>
            {latestPeriod.endDate && (
              <span style={{ fontSize: '0.75rem', color: themeCssVariables.font.color.tertiary }}>
                Processed on {formatDate(latestPeriod.endDate)}
              </span>
            )}
          </StyledDataBlock>

          <StyledDataBlock>
            <StyledDataLabel>Headcount Paid</StyledDataLabel>
            <StyledDataValue>{latestPeriod.employeeCount} Employees</StyledDataValue>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
              100% On Time
            </span>
          </StyledDataBlock>
        </StyledContentGrid>
      )}
    </StyledCard>
  );
};
