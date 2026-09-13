import { useState } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import {
  IconSearch,
  IconPlus,
  IconBriefcase,
  IconUsers,
  IconBuildingSkyscraper,
  IconTargetArrow,
} from 'twenty-ui/icon';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
  box-sizing: border-box;
`;

const StyledHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMainHeading = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledSubHeading = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: 6px 12px;
  width: 220px;
`;

const StyledSearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.primary};
  width: 100%;

  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ variant }) =>
      variant === 'primary'
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.medium};
  background: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.font.color.primary
      : themeCssVariables.background.primary};
  color: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.primary};
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  overflow-x: auto;
  padding-bottom: 2px;
`;

const StyledFilterChip = styled.button<{ isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid
    ${({ isActive }) =>
      isActive ? themeCssVariables.font.color.primary : themeCssVariables.border.color.medium};
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.font.color.primary : themeCssVariables.background.primary};
  color: ${({ isActive }) =>
    isActive ? themeCssVariables.background.primary : themeCssVariables.font.color.secondary};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledJobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledJobCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
`;

const StyledJobCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const StyledJobTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledPriorityBadge = styled.span<{ priority: string }>`
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  background: ${({ priority }) =>
    priority === 'HIGH'
      ? 'rgba(239, 68, 68, 0.1)'
      : priority === 'MEDIUM'
      ? 'rgba(245, 158, 11, 0.1)'
      : 'rgba(16, 185, 129, 0.1)'};
  color: ${({ priority }) =>
    priority === 'HIGH' ? '#ef4444' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981'};
`;

const StyledMetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} 0;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMetaLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
`;

const StyledMetaValue = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledSkillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const StyledSkillPill = styled.span`
  background: ${themeCssVariables.background.secondary};
  border-radius: 4px;
  padding: 2px 7px;
  font-size: 0.6875rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${themeCssVariables.spacing[1]};
`;

const StyledApplicantCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.secondary};
`;

export interface JobRequirement {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  openings: number;
  filled: number;
  experience: string;
  salary: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  skills: string[];
  applicantCount: number;
}

const JOBS_DATA: JobRequirement[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Bangalore',
    workMode: 'Hybrid',
    openings: 3,
    filled: 1,
    experience: '5 - 8 Years',
    salary: '₹28L - ₹38L',
    priority: 'HIGH',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    applicantCount: 24,
  },
  {
    id: 'job-2',
    title: 'Lead Product Designer',
    department: 'Design',
    location: 'Remote',
    workMode: 'Remote',
    openings: 1,
    filled: 0,
    experience: '6 - 10 Years',
    salary: '₹30L - ₹42L',
    priority: 'HIGH',
    skills: ['Figma', 'Design Systems', 'UX Architecture'],
    applicantCount: 16,
  },
  {
    id: 'job-3',
    title: 'Enterprise Account Executive',
    department: 'Sales & BD',
    location: 'Mumbai',
    workMode: 'On-site',
    openings: 2,
    filled: 0,
    experience: '4 - 7 Years',
    salary: '₹18L - ₹26L + Incentives',
    priority: 'MEDIUM',
    skills: ['B2B Sales', 'Enterprise SaaS', 'Negotiation'],
    applicantCount: 12,
  },
  {
    id: 'job-4',
    title: 'Talent Acquisition Partner',
    department: 'Human Resources',
    location: 'Bangalore',
    workMode: 'Hybrid',
    openings: 2,
    filled: 1,
    experience: '3 - 6 Years',
    salary: '₹14L - ₹20L',
    priority: 'MEDIUM',
    skills: ['Technical Recruiting', 'Sourcing', 'Screening'],
    applicantCount: 19,
  },
  {
    id: 'job-5',
    title: 'DevOps & Cloud Engineer',
    department: 'Engineering',
    location: 'Remote',
    workMode: 'Remote',
    openings: 2,
    filled: 0,
    experience: '4 - 8 Years',
    salary: '₹25L - ₹35L',
    priority: 'HIGH',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    applicantCount: 14,
  },
  {
    id: 'job-6',
    title: 'Product Marketing Manager',
    department: 'Marketing',
    location: 'Bangalore',
    workMode: 'Hybrid',
    openings: 1,
    filled: 0,
    experience: '4 - 7 Years',
    salary: '₹20L - ₹28L',
    priority: 'LOW',
    skills: ['GTM Strategy', 'Content', 'Analytics'],
    applicantCount: 8,
  },
];

export const JobsCardView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Engineering', 'Design', 'Sales & BD', 'Human Resources', 'Marketing'];

  const filteredJobs = JOBS_DATA.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <StyledContainer>
      <StyledHeaderRow>
        <StyledHeaderTitle>
          <StyledMainHeading>Job Openings & Requirements</StyledMainHeading>
          <StyledSubHeading>
            Active requisitions, applicant volumes, and hiring targets
          </StyledSubHeading>
        </StyledHeaderTitle>

        <StyledControls>
          <StyledSearchWrap>
            <IconSearch size={14} />
            <StyledSearchInput
              placeholder="Search job or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </StyledSearchWrap>
          <StyledButton variant="primary">
            <IconPlus size={14} />
            <span>Create Opening</span>
          </StyledButton>
        </StyledControls>
      </StyledHeaderRow>

      <StyledFilterRow>
        {departments.map((dept) => (
          <StyledFilterChip
            key={dept}
            isActive={selectedDept === dept}
            onClick={() => setSelectedDept(dept)}
          >
            {dept}
          </StyledFilterChip>
        ))}
      </StyledFilterRow>

      <StyledJobsGrid>
        {filteredJobs.map((job) => (
          <StyledJobCard key={job.id}>
            <StyledJobCardHeader>
              <div>
                <StyledJobTitle>{job.title}</StyledJobTitle>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: themeCssVariables.font.color.tertiary,
                    marginTop: 2,
                  }}
                >
                  {job.department} • {job.location} ({job.workMode})
                </div>
              </div>
              <StyledPriorityBadge priority={job.priority}>
                {job.priority}
              </StyledPriorityBadge>
            </StyledJobCardHeader>

            <StyledMetaGrid>
              <StyledMetaItem>
                <StyledMetaLabel>Experience</StyledMetaLabel>
                <StyledMetaValue>{job.experience}</StyledMetaValue>
              </StyledMetaItem>
              <StyledMetaItem>
                <StyledMetaLabel>Budget / CTC</StyledMetaLabel>
                <StyledMetaValue>{job.salary}</StyledMetaValue>
              </StyledMetaItem>
              <StyledMetaItem>
                <StyledMetaLabel>Openings</StyledMetaLabel>
                <StyledMetaValue>
                  {job.filled} / {job.openings} Filled
                </StyledMetaValue>
              </StyledMetaItem>
              <StyledMetaItem>
                <StyledMetaLabel>Status</StyledMetaLabel>
                <StyledMetaValue style={{ color: '#10b981' }}>Active</StyledMetaValue>
              </StyledMetaItem>
            </StyledMetaGrid>

            <StyledSkillsRow>
              {job.skills.map((s) => (
                <StyledSkillPill key={s}>{s}</StyledSkillPill>
              ))}
            </StyledSkillsRow>

            <StyledCardFooter>
              <StyledApplicantCount>
                <IconUsers size={14} />
                <span>{job.applicantCount} candidates applied</span>
              </StyledApplicantCount>
              <StyledButton
                variant="secondary"
                onClick={() => navigate('/objects/candidates')}
              >
                <span>View Candidates</span>
              </StyledButton>
            </StyledCardFooter>
          </StyledJobCard>
        ))}
      </StyledJobsGrid>
    </StyledContainer>
  );
};
