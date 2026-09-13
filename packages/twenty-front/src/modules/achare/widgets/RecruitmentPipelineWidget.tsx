import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import { IconChevronRight, IconUserPlus } from 'twenty-ui/icon';

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

interface PipelineStageData {
  stage: string;
  count: number;
  color: string;
}

interface RecruitmentPipelineWidgetProps {
  stages?: PipelineStageData[];
}

const DEFAULT_STAGES: PipelineStageData[] = [
  { stage: 'Sourced', count: 28, color: '#94a3b8' },
  { stage: 'Screening', count: 14, color: '#38bdf8' },
  { stage: 'Interview', count: 9, color: '#f59e0b' },
  { stage: 'Offer', count: 4, color: '#ec4899' },
  { stage: 'Joined', count: 12, color: '#10b981' },
];

export const RecruitmentPipelineWidget = ({
  stages = DEFAULT_STAGES,
}: RecruitmentPipelineWidgetProps) => {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconUserPlus size={18} />
          <span>Candidate Pipeline Flow</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/candidates')}>
          <span>Open Pipeline</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      <StyledStages>
        {stages.map((st) => (
          <StyledStageItem key={st.stage} color={st.color}>
            <StyledStageLabel>{st.stage}</StyledStageLabel>
            <StyledStageCount>{st.count}</StyledStageCount>
          </StyledStageItem>
        ))}
      </StyledStages>
    </StyledCard>
  );
};
