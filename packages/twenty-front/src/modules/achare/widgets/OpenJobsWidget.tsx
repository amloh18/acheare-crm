import { useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import { IconBriefcase, IconChevronRight, IconDatabase, IconAlertTriangle } from 'twenty-ui/icon';
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

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledItemLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledJobTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledJobMeta = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledApplicantBadge = styled.div`
  padding: 3px 8px;
  border-radius: 4px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledPriority = styled.span<{ priority: string }>`
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: ${({ priority }) =>
    priority === 'HIGH' ? '#ef4444' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981'};
`;

export const OpenJobsWidget = () => {
  const navigate = useNavigate();

  const { records: requirements, loading, error } = useFindManyRecords({
    objectNameSingular: 'requirement' as CoreObjectNameSingular,
    recordGqlFields: {
      id: true,
      jobTitle: true,
      location: true,
      status: true,
      numberOfOpenings: true,
      priority: true,
    },
    filter: { status: { eq: 'OPEN' } },
  });

  const jobs = useMemo(() => {
    return (requirements as any[]).slice(0, 5).map((req) => ({
      id: req.id,
      title: req.jobTitle || 'Untitled Position',
      location: req.location || 'Remote',
      applicants: req.numberOfOpenings || 0,
      priority: (req.priority || 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
    }));
  }, [requirements]);

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconBriefcase size={18} />
          <span>Active Requirements & Jobs</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/requirements')}>
          <span>View All Jobs</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      {loading ? (
        <StyledEmptyState>
          <StyledEmptyText>Loading jobs...</StyledEmptyText>
        </StyledEmptyState>
      ) : error ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconAlertTriangle size={20} /></StyledEmptyIcon>
          <StyledEmptyText>Unable to load jobs</StyledEmptyText>
        </StyledEmptyState>
      ) : jobs.length === 0 ? (
        <StyledEmptyState>
          <StyledEmptyIcon><IconDatabase size={20} /></StyledEmptyIcon>
          <StyledEmptyText>No open positions</StyledEmptyText>
        </StyledEmptyState>
      ) : (
        <StyledList>
          {jobs.map((job) => (
            <StyledItem key={job.id} onClick={() => navigate('/objects/requirements')}>
              <StyledItemLeft>
                <StyledJobTitle>{job.title}</StyledJobTitle>
                <StyledJobMeta>
                  <span>{job.location}</span>
                  <span>•</span>
                  <StyledPriority priority={job.priority}>{job.priority} PRIORITY</StyledPriority>
                </StyledJobMeta>
              </StyledItemLeft>
              <StyledItemRight>
                <StyledApplicantBadge>
                  {job.applicants} openings
                </StyledApplicantBadge>
              </StyledItemRight>
            </StyledItem>
          ))}
        </StyledList>
      )}
    </StyledCard>
  );
};
