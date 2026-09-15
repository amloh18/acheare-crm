import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import {
  IconCalendarEvent,
  IconChevronRight,
  IconVideo,
  IconDatabase,
  IconAlertTriangle,
} from 'twenty-ui/icon';

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

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.sm};
  border-left: 3px solid #38bdf8;
`;

const StyledItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledCandidateName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledJobTitle = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTimeBadge = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledRoundBadge = styled.div`
  padding: 2px 8px;
  border-radius: 4px;
  background: ${themeCssVariables.background.primary};
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.secondary};
`;

interface InterviewItem {
  id: string;
  candidateName: string;
  jobTitle: string;
  round: string;
  scheduledTime: string;
}

const DEFAULT_INTERVIEWS: InterviewItem[] = [
  {
    id: '1',
    candidateName: 'Priya Sharma',
    jobTitle: 'Senior Full Stack Engineer',
    round: 'Technical Round 2',
    scheduledTime: 'Today, 2:30 PM',
  },
  {
    id: '2',
    candidateName: 'Marcus Vance',
    jobTitle: 'Lead Product Designer',
    round: 'Portfolio Review',
    scheduledTime: 'Today, 4:00 PM',
  },
  {
    id: '3',
    candidateName: 'Ananya Roy',
    jobTitle: 'Talent Acquisition Partner',
    round: 'HR Cultural Fit',
    scheduledTime: 'Tomorrow, 11:00 AM',
  },
];

interface UpcomingInterviewsWidgetProps {
  loading?: boolean;
  error?: boolean;
}

export const UpcomingInterviewsWidget = ({ loading, error }: UpcomingInterviewsWidgetProps) => {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconCalendarEvent size={18} />
          <span>Upcoming Interviews</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/interviews')}>
          <span>Schedule</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      {loading ? (
        <StyledEmptyState>
          <StyledEmptyText>Loading interviews...</StyledEmptyText>
        </StyledEmptyState>
      ) : error ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconAlertTriangle size={20} /></StyledEmptyIcon>
          <StyledEmptyText>Unable to load interviews</StyledEmptyText>
        </StyledEmptyState>
      ) : DEFAULT_INTERVIEWS.length === 0 ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconDatabase size={20} /></StyledEmptyIcon>
          <StyledEmptyText>No upcoming interviews</StyledEmptyText>
        </StyledEmptyState>
      ) : (
        <StyledList>
          {DEFAULT_INTERVIEWS.map((interview) => (
            <StyledItem key={interview.id}>
              <StyledItemLeft>
                <StyledCandidateName>{interview.candidateName}</StyledCandidateName>
                <StyledJobTitle>{interview.jobTitle}</StyledJobTitle>
              </StyledItemLeft>
              <StyledItemRight>
                <StyledTimeBadge>{interview.scheduledTime}</StyledTimeBadge>
                <StyledRoundBadge>{interview.round}</StyledRoundBadge>
              </StyledItemRight>
            </StyledItem>
          ))}
        </StyledList>
      )}
    </StyledCard>
  );
};
