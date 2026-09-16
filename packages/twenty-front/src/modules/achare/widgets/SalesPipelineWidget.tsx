import { useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight, IconTargetArrow, IconDatabase, IconAlertTriangle } from 'twenty-ui/icon';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';

const STAGE_COLORS: Record<string, string> = {
  NEW: '#38bdf8',
  QUALIFIED: '#3b82f6',
  PROPOSAL: '#8b5cf6',
  NEGOTIATION: '#f59e0b',
  CUSTOMER: '#10b981',
  INACTIVE: '#6b7280',
};

const STAGE_LABELS: Record<string, string> = {
  NEW: 'New',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CUSTOMER: 'Won',
  INACTIVE: 'Lost',
};

const STAGE_ORDER = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CUSTOMER', 'INACTIVE'];

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

const StyledPipelineTrack = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  gap: 2px;
  background: ${themeCssVariables.background.secondary};
`;

const StyledSegment = styled.div<{ widthPercent: number; color: string }>`
  height: 100%;
  width: ${({ widthPercent }) => widthPercent}%;
  background: ${({ color }) => color};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const StyledStageList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledStageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${themeCssVariables.spacing[2]};
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.sm};
`;

const StyledStageHead = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: 500;
`;

const StyledDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

const StyledAmount = styled.div`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledDealCount = styled.div`
  font-size: 0.6875rem;
  color: ${themeCssVariables.font.color.secondary};
`;

export const SalesPipelineWidget = () => {
  const navigate = useNavigate();

  const { records: opportunities, loading, error } = useFindManyRecords({
    objectNameSingular: CoreObjectNameSingular.Opportunity,
    recordGqlFields: {
      id: true,
      stage: true,
      amount: { amountMicros: true, currencyCode: true },
    },
  });

  const stages = useMemo(() => {
    const grouped: Record<string, { count: number; totalMicros: number }> = {};

    for (const stage of STAGE_ORDER) {
      grouped[stage] = { count: 0, totalMicros: 0 };
    }

    for (const opp of opportunities as any[]) {
      const stage = opp.stage || 'NEW';
      if (!grouped[stage]) {
        grouped[stage] = { count: 0, totalMicros: 0 };
      }
      grouped[stage].count++;
      grouped[stage].totalMicros += opp.amount?.amountMicros ?? 0;
    }

    const totalCount = opportunities.length || 1;

    return STAGE_ORDER
      .filter((stage) => grouped[stage].count > 0)
      .map((stage) => ({
        name: STAGE_LABELS[stage] || stage,
        amount: `${(grouped[stage].totalMicros / 1_000_000).toFixed(1)}`,
        count: grouped[stage].count,
        color: STAGE_COLORS[stage] || '#6b7280',
        weight: (grouped[stage].count / totalCount) * 100,
      }));
  }, [opportunities]);

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconTargetArrow size={18} />
          <span>Sales & Deal Pipeline</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/opportunities')}>
          <span>View Deals</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      {loading ? (
        <StyledEmptyState>
          <StyledEmptyText>Loading pipeline data...</StyledEmptyText>
        </StyledEmptyState>
      ) : error ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconAlertTriangle size={20} /></StyledEmptyIcon>
          <StyledEmptyText>Unable to load pipeline</StyledEmptyText>
        </StyledEmptyState>
      ) : stages.length === 0 ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconDatabase size={20} /></StyledEmptyIcon>
          <StyledEmptyText>No deals in pipeline</StyledEmptyText>
        </StyledEmptyState>
      ) : (
        <>
          <StyledPipelineTrack>
            {stages.map((st) => (
              <StyledSegment
                key={st.name}
                widthPercent={st.weight}
                color={st.color}
              />
            ))}
          </StyledPipelineTrack>

          <StyledStageList>
            {stages.map((st) => (
              <StyledStageItem key={st.name}>
                <StyledStageHead>
                  <StyledDot color={st.color} />
                  <span>{st.name}</span>
                </StyledStageHead>
                <StyledAmount>${st.amount}K</StyledAmount>
                <StyledDealCount>{st.count} opportunities</StyledDealCount>
              </StyledStageItem>
            ))}
          </StyledStageList>
        </>
      )}
    </StyledCard>
  );
};
