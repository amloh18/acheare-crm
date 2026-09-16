import { useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight, IconUserPlus, IconDatabase, IconAlertTriangle } from 'twenty-ui/icon';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';

const STAGE_ORDER = ['TO_REVIEW', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

const STAGE_LABELS: Record<string, string> = {
  TO_REVIEW: 'To Review',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

const STAGE_COLORS: Record<string, string> = {
  TO_REVIEW: '#6366f1',
  INTERVIEW: '#3b82f6',
  OFFER: '#f59e0b',
  HIRED: '#10b981',
  REJECTED: '#ef4444',
};

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

const StyledStages = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledStageItem = styled.div<{ color: string }>`
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[2]};
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 3px solid ${({ color }) => color};
`;

const StyledStageLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
`;

const StyledStageCount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

export const RecruitmentPipelineWidget = () => {
  const navigate = useNavigate();

  const { records: submissions, loading, error } = useFindManyRecords({
    objectNameSingular: 'candidateSubmission' as CoreObjectNameSingular,
    recordGqlFields: {
      id: true,
      stage: true,
    },
  });

  const stages = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const stage of STAGE_ORDER) {
      counts[stage] = 0;
    }

    for (const sub of submissions as any[]) {
      const stage = sub.stage || 'TO_REVIEW';
      counts[stage] = (counts[stage] || 0) + 1;
    }

    return STAGE_ORDER
      .filter((stage) => counts[stage] > 0)
      .map((stage) => ({
        stage: STAGE_LABELS[stage] || stage,
        count: counts[stage],
        color: STAGE_COLORS[stage] || '#6b7280',
      }));
  }, [submissions]);

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconUserPlus size={18} />
          <span>Candidate Pipeline Flow</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/candidateSubmissions')}>
          <span>Open Pipeline</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      {loading ? (
        <StyledEmptyState>
          <StyledEmptyText>Loading pipeline...</StyledEmptyText>
        </StyledEmptyState>
      ) : error ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconAlertTriangle size={20} /></StyledEmptyIcon>
          <StyledEmptyText>Unable to load pipeline</StyledEmptyText>
        </StyledEmptyState>
      ) : stages.length === 0 ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconDatabase size={20} /></StyledEmptyIcon>
          <StyledEmptyText>No candidates in pipeline</StyledEmptyText>
        </StyledEmptyState>
      ) : (
        <StyledStages>
          {stages.map((st) => (
            <StyledStageItem key={st.stage} color={st.color}>
              <StyledStageLabel>{st.stage}</StyledStageLabel>
              <StyledStageCount>{st.count}</StyledStageCount>
            </StyledStageItem>
          ))}
        </StyledStages>
      )}
    </StyledCard>
  );
};
