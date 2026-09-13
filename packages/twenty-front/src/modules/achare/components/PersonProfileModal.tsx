import { useState, useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconX,
  IconUser,
  IconBriefcase,
  IconClock,
  IconCalendar,
  IconCreditCard,
  IconFileText,
  IconHistory,
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconMap,
  IconCheck,
  IconUserPlus,
  IconArrowRight,
  IconDownload,
} from 'twenty-ui/icon';
import { UnifiedPerson, EmploymentData, CandidateApplication } from '../types/acharePeople';
import { useUnifiedPeople } from '../hooks/useUnifiedPeople';

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledModal = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  width: 100%;
  max-width: 900px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[5]} ${themeCssVariables.spacing[5]}
    ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledProfileLead = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledAvatar = styled.div<{ bg: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
`;

const StyledProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledHeadline = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
`;

const StyledBadge = styled.span<{ variant?: 'inHouse' | 'candidate' | 'contact' | 'role' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${({ variant }) =>
    variant === 'inHouse'
      ? '#dbeafe'
      : variant === 'candidate'
      ? '#f3e8ff'
      : variant === 'contact'
      ? '#dcfce7'
      : '#f1f5f9'};
  color: ${({ variant }) =>
    variant === 'inHouse'
      ? '#1e40af'
      : variant === 'candidate'
      ? '#6b21a8'
      : variant === 'contact'
      ? '#166534'
      : '#475569'};
  border: 1px solid
    ${({ variant }) =>
      variant === 'inHouse'
        ? '#bfdbfe'
        : variant === 'candidate'
        ? '#e9d5ff'
        : variant === 'contact'
        ? '#bbf7d0'
        : '#e2e8f0'};
`;

const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledActionBtn = styled.button<{ primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${({ primary }) =>
      primary ? '#16a34a' : themeCssVariables.border.color.medium};
  background: ${({ primary }) =>
    primary ? '#16a34a' : themeCssVariables.background.primary};
  color: ${({ primary }) =>
    primary ? '#ffffff' : themeCssVariables.font.color.primary};
  transition: all 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledCloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTabsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 ${themeCssVariables.spacing[5]};
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  overflow-x: auto;
`;

const StyledTab = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ isActive }) => (isActive ? themeCssVariables.font.color.primary : 'transparent')};
  font-size: 0.8125rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledBody = styled.div`
  padding: ${themeCssVariables.spacing[5]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledCardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${themeCssVariables.font.color.secondary};
  margin: 0;
`;

const StyledGrid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledInfoLabel = styled.span`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: 500;
`;

const StyledInfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledPillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledSkillPill = styled.span`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.primary};
  font-weight: 500;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;

  th {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid ${themeCssVariables.border.color.medium};
    color: ${themeCssVariables.font.color.tertiary};
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  td {
    padding: 10px 8px;
    border-bottom: 1px solid ${themeCssVariables.border.color.light};
    color: ${themeCssVariables.font.color.primary};
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const StyledStageBadge = styled.span<{ stage: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: ${({ stage }) =>
    stage === 'HIRED' || stage === 'JOINED'
      ? '#dcfce7'
      : stage === 'OFFER'
      ? '#fce7f3'
      : stage === 'INTERVIEW'
      ? '#fef3c7'
      : '#e0f2fe'};
  color: ${({ stage }) =>
    stage === 'HIRED' || stage === 'JOINED'
      ? '#166534'
      : stage === 'OFFER'
      ? '#9d174d'
      : stage === 'INTERVIEW'
      ? '#92400e'
      : '#0369a1'};
`;

const StyledConversionModal = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

interface PersonProfileModalProps {
  person: UnifiedPerson | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonProfileModal = ({
  person,
  isOpen,
  onClose,
}: PersonProfileModalProps) => {
  const { convertCandidateToEmployee, updatePerson } = useUnifiedPeople();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showHiringDialog, setShowHiringDialog] = useState(false);

  // Hiring Form Fields
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState(
    () => new Date().toISOString().split('T')[0],
  );

  if (!isOpen || !person) return null;

  const isCandidate =
    person.contexts.includes('CANDIDATE') || Boolean(person.candidateProfile);
  const isInHouse =
    person.inHouse ||
    person.contexts.includes('IN_HOUSE') ||
    Boolean(person.employment);
  const isContact =
    person.contexts.includes('CONTACT') ||
    Boolean(person.companyRelationship);

  const canBeHired = isCandidate && !person.employment;

  const handleExecuteHire = (e: React.FormEvent) => {
    e.preventDefault();
    convertCandidateToEmployee(person.id, {
      employeeCode: `ACH-${Math.floor(100 + Math.random() * 900)}`,
      department: department || 'Engineering',
      designation: designation || person.headline || 'Engineer',
      employmentType: 'FULL_TIME',
      joiningDate: joiningDate || new Date().toISOString().split('T')[0],
      workLocation: `${person.city} HQ`,
      status: 'ACTIVE',
      salaryMonthly: '₹2,60,000',
    });
    setShowHiringDialog(false);
    setActiveTab('employment');
  };

  const handleAdvanceStage = (appId: string, currentStage: string) => {
    if (!person.candidateProfile) return;
    const stages: CandidateApplication['stage'][] = [
      'APPLIED',
      'SCREENING',
      'SHORTLISTED',
      'INTERVIEW',
      'OFFER',
      'HIRED',
    ];
    const currentIndex = stages.indexOf(
      currentStage as CandidateApplication['stage'],
    );
    const nextStage =
      currentIndex >= 0 && currentIndex < stages.length - 1
        ? stages[currentIndex + 1]
        : currentStage;

    const updatedApps = person.candidateProfile.applications.map((app) =>
      app.id === appId ? { ...app, stage: nextStage as any } : app,
    );

    updatePerson(person.id, {
      candidateProfile: {
        ...person.candidateProfile,
        applications: updatedApps,
      },
    });

    if (nextStage === 'HIRED') {
      setShowHiringDialog(true);
    }
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledProfileLead>
              <StyledAvatar bg={person.avatarBg}>{person.initials}</StyledAvatar>
              <StyledProfileInfo>
                <StyledName>{person.name}</StyledName>
                <StyledHeadline>{person.headline || person.city}</StyledHeadline>
                <StyledBadgeRow>
                  {person.contexts.map((ctx) => (
                    <StyledBadge
                      key={ctx}
                      variant={
                        ctx === 'IN_HOUSE'
                          ? 'inHouse'
                          : ctx === 'CANDIDATE'
                          ? 'candidate'
                          : ctx === 'CONTACT'
                          ? 'contact'
                          : 'role'
                      }
                    >
                      {ctx === 'IN_HOUSE'
                        ? 'In-house · Team'
                        : ctx === 'CANDIDATE'
                        ? 'Candidate'
                        : ctx === 'CONTACT'
                        ? 'Contact'
                        : 'Contractor'}
                    </StyledBadge>
                  ))}
                  {person.roles.map((role) => (
                    <StyledBadge key={role} variant="role">
                      {role}
                    </StyledBadge>
                  ))}
                  <StyledBadge variant="inHouse">
                    {person.status}
                  </StyledBadge>
                </StyledBadgeRow>
              </StyledProfileInfo>
            </StyledProfileLead>

            <StyledHeaderActions>
              {canBeHired && (
                <StyledActionBtn
                  primary
                  onClick={() => setShowHiringDialog(true)}
                >
                  <IconUserPlus size={15} />
                  <span>Hire & Convert to Employee</span>
                </StyledActionBtn>
              )}
              <StyledCloseBtn onClick={onClose}>
                <IconX size={20} />
              </StyledCloseBtn>
            </StyledHeaderActions>
          </StyledHeaderTop>
        </StyledHeader>

        {/* Dynamic Context Tabs */}
        <StyledTabsBar>
          <StyledTab
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            <IconUser size={14} />
            <span>Overview</span>
          </StyledTab>

          {isInHouse && (
            <StyledTab
              isActive={activeTab === 'employment'}
              onClick={() => setActiveTab('employment')}
            >
              <IconBriefcase size={14} />
              <span>Employment</span>
            </StyledTab>
          )}

          {isCandidate && (
            <StyledTab
              isActive={activeTab === 'recruitment'}
              onClick={() => setActiveTab('recruitment')}
            >
              <IconUserPlus size={14} />
              <span>Recruitment ({person.candidateProfile?.applications.length || 1})</span>
            </StyledTab>
          )}

          {isContact && (
            <StyledTab
              isActive={activeTab === 'crm'}
              onClick={() => setActiveTab('crm')}
            >
              <IconBuildingSkyscraper size={14} />
              <span>CRM & Company</span>
            </StyledTab>
          )}

          {isInHouse && (
            <>
              <StyledTab
                isActive={activeTab === 'attendance'}
                onClick={() => setActiveTab('attendance')}
              >
                <IconClock size={14} />
                <span>Attendance</span>
              </StyledTab>
              <StyledTab
                isActive={activeTab === 'leave'}
                onClick={() => setActiveTab('leave')}
              >
                <IconCalendar size={14} />
                <span>Leave</span>
              </StyledTab>
              <StyledTab
                isActive={activeTab === 'payroll'}
                onClick={() => setActiveTab('payroll')}
              >
                <IconCreditCard size={14} />
                <span>Payroll</span>
              </StyledTab>
            </>
          )}

          <StyledTab
            isActive={activeTab === 'documents'}
            onClick={() => setActiveTab('documents')}
          >
            <IconFileText size={14} />
            <span>Documents ({person.documents?.length || 0})</span>
          </StyledTab>

          <StyledTab
            isActive={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          >
            <IconHistory size={14} />
            <span>Activity</span>
          </StyledTab>
        </StyledTabsBar>

        <StyledBody>
          {/* Candidate -> Employee Conversion Dialog */}
          {showHiringDialog && (
            <StyledConversionModal>
              <div style={{ fontWeight: 700, color: '#166534', fontSize: '1rem' }}>
                🎉 Hire {person.name} as Team Member
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#15803d' }}>
                This creates an active Employment relationship and attaches the
                In-house context to this Person. Their candidate history,
                applications, and resumes will be preserved under this exact same
                Person ID!
              </div>
              <form onSubmit={handleExecuteHire} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <StyledGrid2>
                  <StyledInfoItem>
                    <StyledInfoLabel>Department</StyledInfoLabel>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #86efac' }}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Sales & BD">Sales & BD</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </StyledInfoItem>
                  <StyledInfoItem>
                    <StyledInfoLabel>Designation</StyledInfoLabel>
                    <input
                      placeholder="e.g. Senior Backend Engineer"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #86efac' }}
                    />
                  </StyledInfoItem>
                  <StyledInfoItem>
                    <StyledInfoLabel>Joining Date</StyledInfoLabel>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #86efac' }}
                    />
                  </StyledInfoItem>
                </StyledGrid2>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <StyledActionBtn primary type="submit">
                    Confirm Hire & Activate Employee
                  </StyledActionBtn>
                  <StyledActionBtn type="button" onClick={() => setShowHiringDialog(false)}>
                    Cancel
                  </StyledActionBtn>
                </div>
              </form>
            </StyledConversionModal>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <StyledCard>
                <StyledCardTitle>Contact & Master Identity</StyledCardTitle>
                <StyledGrid2>
                  <StyledInfoItem>
                    <StyledInfoLabel>Email Address</StyledInfoLabel>
                    <StyledInfoValue>{person.email}</StyledInfoValue>
                  </StyledInfoItem>
                  <StyledInfoItem>
                    <StyledInfoLabel>Phone Number</StyledInfoLabel>
                    <StyledInfoValue>{person.phone}</StyledInfoValue>
                  </StyledInfoItem>
                  <StyledInfoItem>
                    <StyledInfoLabel>City / Base Location</StyledInfoLabel>
                    <StyledInfoValue>{person.city}</StyledInfoValue>
                  </StyledInfoItem>
                  <StyledInfoItem>
                    <StyledInfoLabel>Canonical Person ID</StyledInfoLabel>
                    <StyledInfoValue style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {person.id}
                    </StyledInfoValue>
                  </StyledInfoItem>
                </StyledGrid2>
              </StyledCard>

              <StyledCard>
                <StyledCardTitle>Active Business Contexts</StyledCardTitle>
                <StyledGrid2>
                  {person.employment && (
                    <StyledInfoItem>
                      <StyledInfoLabel>In-House Employment</StyledInfoLabel>
                      <StyledInfoValue>
                        {person.employment.designation} ({person.employment.department})
                      </StyledInfoValue>
                    </StyledInfoItem>
                  )}
                  {person.candidateProfile && (
                    <StyledInfoItem>
                      <StyledInfoLabel>Candidate Profile</StyledInfoLabel>
                      <StyledInfoValue>
                        {person.candidateProfile.totalExperienceYears} Yrs Exp ·{' '}
                        {person.candidateProfile.applications.length} Application(s)
                      </StyledInfoValue>
                    </StyledInfoItem>
                  )}
                  {person.companyRelationship && (
                    <StyledInfoItem>
                      <StyledInfoLabel>Company Relationship</StyledInfoLabel>
                      <StyledInfoValue>
                        {person.companyRelationship.jobTitle} at{' '}
                        {person.companyRelationship.companyName}
                      </StyledInfoValue>
                    </StyledInfoItem>
                  )}
                </StyledGrid2>
              </StyledCard>
            </>
          )}

          {/* EMPLOYMENT TAB */}
          {activeTab === 'employment' && person.employment && (
            <StyledCard>
              <StyledCardTitle>Employment Details</StyledCardTitle>
              <StyledGrid2>
                <StyledInfoItem>
                  <StyledInfoLabel>Employee Code</StyledInfoLabel>
                  <StyledInfoValue>{person.employment.employeeCode}</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Department</StyledInfoLabel>
                  <StyledInfoValue>{person.employment.department}</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Designation</StyledInfoLabel>
                  <StyledInfoValue>{person.employment.designation}</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Employment Type</StyledInfoLabel>
                  <StyledInfoValue>{person.employment.employmentType}</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Joining Date</StyledInfoLabel>
                  <StyledInfoValue>{person.employment.joiningDate}</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Work Location</StyledInfoLabel>
                  <StyledInfoValue>{person.employment.workLocation}</StyledInfoValue>
                </StyledInfoItem>
                {person.employment.managerName && (
                  <StyledInfoItem>
                    <StyledInfoLabel>Reporting Manager</StyledInfoLabel>
                    <StyledInfoValue>{person.employment.managerName}</StyledInfoValue>
                  </StyledInfoItem>
                )}
                {person.employment.salaryMonthly && (
                  <StyledInfoItem>
                    <StyledInfoLabel>Monthly Gross Salary</StyledInfoLabel>
                    <StyledInfoValue>{person.employment.salaryMonthly}</StyledInfoValue>
                  </StyledInfoItem>
                )}
              </StyledGrid2>
            </StyledCard>
          )}

          {/* RECRUITMENT TAB */}
          {activeTab === 'recruitment' && (
            <>
              {person.candidateProfile && (
                <StyledCard>
                  <StyledCardTitle>Candidate Sourcing Profile</StyledCardTitle>
                  <StyledGrid2>
                    <StyledInfoItem>
                      <StyledInfoLabel>Total Experience</StyledInfoLabel>
                      <StyledInfoValue>
                        {person.candidateProfile.totalExperienceYears} Years
                      </StyledInfoValue>
                    </StyledInfoItem>
                    {person.candidateProfile.expectedSalary && (
                      <StyledInfoItem>
                        <StyledInfoLabel>Expected Salary</StyledInfoLabel>
                        <StyledInfoValue>
                          {person.candidateProfile.expectedSalary}
                        </StyledInfoValue>
                      </StyledInfoItem>
                    )}
                    {person.candidateProfile.noticePeriod && (
                      <StyledInfoItem>
                        <StyledInfoLabel>Notice Period</StyledInfoLabel>
                        <StyledInfoValue>
                          {person.candidateProfile.noticePeriod}
                        </StyledInfoValue>
                      </StyledInfoItem>
                    )}
                  </StyledGrid2>
                  <StyledInfoItem style={{ marginTop: 8 }}>
                    <StyledInfoLabel>Technical & Core Skills</StyledInfoLabel>
                    <StyledPillList style={{ marginTop: 4 }}>
                      {person.candidateProfile.skills.map((skill) => (
                        <StyledSkillPill key={skill}>{skill}</StyledSkillPill>
                      ))}
                    </StyledPillList>
                  </StyledInfoItem>
                </StyledCard>
              )}

              <StyledCard>
                <StyledCardTitle>Job Applications Pipeline</StyledCardTitle>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Job Opening</th>
                      <th>Department</th>
                      <th>Applied Date</th>
                      <th>Current Stage</th>
                      <th>Stage Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {person.candidateProfile?.applications.map((app) => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>{app.jobTitle}</td>
                        <td>{app.department}</td>
                        <td>{app.appliedDate}</td>
                        <td>
                          <StyledStageBadge stage={app.stage}>
                            {app.stage}
                          </StyledStageBadge>
                        </td>
                        <td>
                          {app.stage !== 'HIRED' ? (
                            <StyledActionBtn
                              onClick={() =>
                                handleAdvanceStage(app.id, app.stage)
                              }
                            >
                              <span>Advance</span>
                              <IconArrowRight size={12} />
                            </StyledActionBtn>
                          ) : (
                            <span style={{ color: '#16a34a', fontWeight: 600 }}>
                              ✓ Hired into Team
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              </StyledCard>
            </>
          )}

          {/* CRM TAB */}
          {activeTab === 'crm' && person.companyRelationship && (
            <StyledCard>
              <StyledCardTitle>Company Account Relationship</StyledCardTitle>
              <StyledGrid2>
                <StyledInfoItem>
                  <StyledInfoLabel>Company Name</StyledInfoLabel>
                  <StyledInfoValue>
                    {person.companyRelationship.companyName}
                  </StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Job Title / Designation</StyledInfoLabel>
                  <StyledInfoValue>
                    {person.companyRelationship.jobTitle}
                  </StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Relationship Status</StyledInfoLabel>
                  <StyledInfoValue>
                    {person.companyRelationship.relationshipStatus}
                  </StyledInfoValue>
                </StyledInfoItem>
                {person.companyRelationship.isDecisionMaker && (
                  <StyledInfoItem>
                    <StyledInfoLabel>Decision Maker</StyledInfoLabel>
                    <StyledInfoValue style={{ color: '#16a34a' }}>
                      ✓ Primary Decision Maker
                    </StyledInfoValue>
                  </StyledInfoItem>
                )}
              </StyledGrid2>
            </StyledCard>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <StyledCard>
              <StyledCardTitle>Recent Attendance Records</StyledCardTitle>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Worked Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {person.attendanceHistory?.map((att) => (
                    <tr key={att.id}>
                      <td>{att.date}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: att.status === 'PRESENT' ? '#16a34a' : '#0ea5e9' }}>
                          {att.status}
                        </span>
                      </td>
                      <td>{att.checkIn}</td>
                      <td>{att.checkOut || 'Active'}</td>
                      <td>{att.workedHours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </StyledCard>
          )}

          {/* LEAVE TAB */}
          {activeTab === 'leave' && (
            <StyledCard>
              <StyledCardTitle>Leave Requests & Balance</StyledCardTitle>
              <StyledGrid2 style={{ marginBottom: 12 }}>
                <StyledInfoItem>
                  <StyledInfoLabel>Casual Leave Balance</StyledInfoLabel>
                  <StyledInfoValue>8 Days</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Sick Leave Balance</StyledInfoLabel>
                  <StyledInfoValue>6 Days</StyledInfoValue>
                </StyledInfoItem>
                <StyledInfoItem>
                  <StyledInfoLabel>Paid Vacation</StyledInfoLabel>
                  <StyledInfoValue>14 Days</StyledInfoValue>
                </StyledInfoItem>
              </StyledGrid2>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {person.leaveRecords?.map((l) => (
                    <tr key={l.id}>
                      <td>{l.type}</td>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td>{l.days} Day(s)</td>
                      <td style={{ color: '#16a34a', fontWeight: 600 }}>{l.status}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </StyledCard>
          )}

          {/* PAYROLL TAB */}
          {activeTab === 'payroll' && (
            <StyledCard>
              <StyledCardTitle>Salary & Payslips Vault</StyledCardTitle>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Gross Salary</th>
                    <th>Net Disbursed</th>
                    <th>Payment Status</th>
                    <th>Pay Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {person.payslips?.map((ps) => (
                    <tr key={ps.id}>
                      <td style={{ fontWeight: 600 }}>{ps.period}</td>
                      <td>{ps.grossSalary}</td>
                      <td>{ps.netSalary}</td>
                      <td>
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>
                          ✓ {ps.status}
                        </span>
                      </td>
                      <td>{ps.payDate}</td>
                      <td>
                        <StyledActionBtn>
                          <IconDownload size={12} />
                          <span>PDF</span>
                        </StyledActionBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </StyledCard>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <StyledCard>
              <StyledCardTitle>Attached Universal Documents</StyledCardTitle>
              {person.documents && person.documents.length > 0 ? (
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Uploaded On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {person.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 600 }}>{doc.name}</td>
                        <td>
                          <StyledBadge>{doc.category}</StyledBadge>
                        </td>
                        <td>{doc.size}</td>
                        <td>{doc.uploadedAt}</td>
                        <td>
                          <StyledActionBtn>
                            <IconDownload size={12} />
                            <span>Download</span>
                          </StyledActionBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              ) : (
                <div style={{ padding: 16, color: themeCssVariables.font.color.tertiary, fontSize: '0.8125rem' }}>
                  No documents attached to this person yet.
                </div>
              )}
            </StyledCard>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <StyledCard>
              <StyledCardTitle>Universal Timeline & Interaction History</StyledCardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: themeCssVariables.font.color.tertiary }}>2026-09-13:</span>
                  <span>Clocked in at 09:05 AM for daily shift.</span>
                </div>
                {person.candidateProfile && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: themeCssVariables.font.color.tertiary }}>2026-08-20:</span>
                    <span>Applied for {person.candidateProfile.applications[0]?.jobTitle || 'Role'}.</span>
                  </div>
                )}
                {person.employment && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: themeCssVariables.font.color.tertiary }}>{person.employment.joiningDate}:</span>
                    <span>Joined {person.employment.department} as {person.employment.designation}.</span>
                  </div>
                )}
              </div>
            </StyledCard>
          )}
        </StyledBody>
      </StyledModal>
    </StyledOverlay>
  );
};
