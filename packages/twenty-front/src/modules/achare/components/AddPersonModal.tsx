import { useState, useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconX,
  IconUser,
  IconMail,
  IconPhone,
  IconMap,
  IconAlertTriangle,
  IconCheck,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconPlus,
} from 'twenty-ui/icon';
import { PersonContext, OrganizationRole, UnifiedPerson } from '../types/acharePeople';
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
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
`;

const StyledModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[4]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledCloseButton = styled.button`
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
    background: ${themeCssVariables.background.secondary};
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 0.8125rem;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.primary};
  color: ${themeCssVariables.font.color.primary};
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-size: 0.8125rem;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.primary};
  color: ${themeCssVariables.font.color.primary};
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledPillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledSelectablePill = styled.button<{ isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.medium};
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.font.color.primary
      : themeCssVariables.background.primary};
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.secondary};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledDuplicateAlert = styled.div`
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledDuplicateAlertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b45309;
`;

const StyledDuplicateAlertBody = styled.div`
  font-size: 0.75rem;
  color: #78350f;
  line-height: 1.4;
`;

const StyledDuplicateActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const StyledAlertButton = styled.button<{ primary?: boolean }>`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ primary }) => (primary ? '#b45309' : '#d97706')};
  background: ${({ primary }) => (primary ? '#b45309' : '#ffffff')};
  color: ${({ primary }) => (primary ? '#ffffff' : '#78350f')};

  &:hover {
    opacity: 0.9;
  }
`;

const StyledSectionDivider = styled.div`
  border-top: 1px dashed ${themeCssVariables.border.color.light};
  margin: 4px 0;
  position: relative;
  text-align: center;
`;

const StyledDividerLabel = styled.span`
  background: ${themeCssVariables.background.primary};
  padding: 0 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  position: relative;
  top: -8px;
`;

const StyledModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[4]};
  border-top: 1px solid ${themeCssVariables.border.color.light};
  background: ${themeCssVariables.background.secondary};
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 7px 16px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.8125rem;
  font-weight: 600;
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

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContext?: PersonContext;
}

const AVAILABLE_CONTEXTS: { id: PersonContext; label: string }[] = [
  { id: 'IN_HOUSE', label: 'In-house (Team)' },
  { id: 'CANDIDATE', label: 'Candidate' },
  { id: 'CONTACT', label: 'Client Contact' },
  { id: 'CONTRACTOR', label: 'Contractor' },
];

const AVAILABLE_ROLES: { id: OrganizationRole; label: string }[] = [
  { id: 'ADMIN', label: 'Admin' },
  { id: 'HR', label: 'HR' },
  { id: 'RECRUITER', label: 'Recruiter' },
  { id: 'BDE', label: 'BDE / Sales' },
  { id: 'MANAGER', label: 'Manager' },
  { id: 'EMPLOYEE', label: 'Employee' },
];

export const AddPersonModal = ({
  isOpen,
  onClose,
  defaultContext,
}: AddPersonModalProps) => {
  const { people, addPerson, attachContextToPerson, findDuplicates } =
    useUnifiedPeople();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [jobTitle, setJobTitle] = useState('');
  const [selectedContexts, setSelectedContexts] = useState<PersonContext[]>(() =>
    defaultContext ? [defaultContext] : ['IN_HOUSE'],
  );
  const [selectedRoles, setSelectedRoles] = useState<OrganizationRole[]>(['EMPLOYEE']);

  // Candidate Profile Specifics
  const [experienceYears, setExperienceYears] = useState('4');
  const [currentCompany, setCurrentCompany] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('30 Days');
  const [skills, setSkills] = useState('React, TypeScript');

  // Employment Specifics
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [managerId, setManagerId] = useState('');

  // Contact Specifics
  const [companyName, setCompanyName] = useState('');

  // Real-time Duplicate Detection
  const potentialDuplicates = useMemo(() => {
    if (!name && !email && !phone) return [];
    return findDuplicates(name, email, phone);
  }, [name, email, phone, findDuplicates]);

  if (!isOpen) return null;

  const toggleContext = (ctx: PersonContext) => {
    setSelectedContexts((prev) =>
      prev.includes(ctx) ? prev.filter((c) => c !== ctx) : [...prev, ctx],
    );
  };

  const toggleRole = (role: OrganizationRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleAttachContextToExisting = (existingPerson: UnifiedPerson) => {
    selectedContexts.forEach((ctx) => {
      attachContextToPerson(
        existingPerson.id,
        ctx,
        selectedRoles[0] || undefined,
      );
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const isInHouse = selectedContexts.includes('IN_HOUSE');
    const isCandidate = selectedContexts.includes('CANDIDATE');
    const isContact = selectedContexts.includes('CONTACT');
    const isContractor = selectedContexts.includes('CONTRACTOR');

    const nameParts = name.trim().split(' ');
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    const colors = ['#3b82f6', '#8b5cf6', '#059669', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    addPerson({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98765 00000',
      city: city.trim(),
      avatarBg,
      initials,
      headline: jobTitle.trim() || `${designation || 'Specialist'} · ${department}`,
      inHouse: isInHouse,
      contexts: selectedContexts.length > 0 ? selectedContexts : ['IN_HOUSE'],
      roles: selectedRoles,
      status: 'ACTIVE',
      employment:
        isInHouse || isContractor
          ? {
              id: `emp-${Date.now()}`,
              employeeCode: `ACH-${Math.floor(100 + Math.random() * 900)}`,
              department: department || 'Engineering',
              designation: designation || jobTitle || 'Engineer',
              employmentType: isContractor ? 'CONTRACT' : 'FULL_TIME',
              joiningDate: new Date().toISOString().split('T')[0],
              workLocation: `${city} HQ`,
              status: 'ACTIVE',
              managerId: managerId || undefined,
            }
          : undefined,
      candidateProfile: isCandidate
        ? {
            id: `cand-${Date.now()}`,
            totalExperienceYears: parseInt(experienceYears, 10) || 3,
            currentCompany: currentCompany || undefined,
            expectedSalary: expectedSalary || undefined,
            noticePeriod,
            skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
            applications: [],
            interviews: [],
          }
        : undefined,
      companyRelationship: isContact
        ? {
            companyId: `comp-${Date.now()}`,
            companyName: companyName || 'Client Partner',
            jobTitle: jobTitle || 'Point of Contact',
            relationshipStatus: 'ACTIVE_CLIENT',
          }
        : undefined,
    });

    onClose();
  };

  const inHouseManagers = people.filter((p) => p.inHouse && p.employment);

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledModalHeader>
          <StyledTitle>Add Person to Achare Master Directory</StyledTitle>
          <StyledCloseButton onClick={onClose}>
            <IconX size={18} />
          </StyledCloseButton>
        </StyledModalHeader>

        <StyledForm onSubmit={handleSubmit}>
          {/* Real-Time Duplicate Warning Banner */}
          {potentialDuplicates.length > 0 && (
            <StyledDuplicateAlert>
              <StyledDuplicateAlertHeader>
                <IconAlertTriangle size={16} />
                <span>Possible Existing Person Detected</span>
              </StyledDuplicateAlertHeader>
              <StyledDuplicateAlertBody>
                We found existing record(s) matching your input:
                {potentialDuplicates.map((dup) => (
                  <div key={dup.id} style={{ marginTop: 4, fontWeight: 500 }}>
                    • <strong>{dup.name}</strong> ({dup.email}) — Contexts:{' '}
                    {dup.contexts.join(', ')}
                  </div>
                ))}
              </StyledDuplicateAlertBody>
              <StyledDuplicateActions>
                <StyledAlertButton
                  type="button"
                  primary
                  onClick={() =>
                    handleAttachContextToExisting(potentialDuplicates[0])
                  }
                >
                  Attach new context to {potentialDuplicates[0].name}
                </StyledAlertButton>
              </StyledDuplicateActions>
            </StyledDuplicateAlert>
          )}

          {/* Identity Fields */}
          <StyledRow>
            <StyledFieldGroup>
              <StyledLabel>Full Name *</StyledLabel>
              <StyledInput
                required
                placeholder="e.g. John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </StyledFieldGroup>
            <StyledFieldGroup>
              <StyledLabel>Email Address *</StyledLabel>
              <StyledInput
                required
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </StyledFieldGroup>
          </StyledRow>

          <StyledRow>
            <StyledFieldGroup>
              <StyledLabel>Phone Number</StyledLabel>
              <StyledInput
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </StyledFieldGroup>
            <StyledFieldGroup>
              <StyledLabel>City / Location</StyledLabel>
              <StyledInput
                placeholder="e.g. Bangalore, Remote"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </StyledFieldGroup>
          </StyledRow>

          <StyledFieldGroup>
            <StyledLabel>Headline / Job Title</StyledLabel>
            <StyledInput
              placeholder="e.g. Senior Frontend Engineer · React Specialist"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </StyledFieldGroup>

          {/* Contexts & Classifications */}
          <StyledFieldGroup>
            <StyledLabel>Business Contexts (Multiple Allowed)</StyledLabel>
            <StyledPillsContainer>
              {AVAILABLE_CONTEXTS.map((ctx) => (
                <StyledSelectablePill
                  key={ctx.id}
                  type="button"
                  isSelected={selectedContexts.includes(ctx.id)}
                  onClick={() => toggleContext(ctx.id)}
                >
                  {selectedContexts.includes(ctx.id) && <IconCheck size={12} />}
                  <span>{ctx.label}</span>
                </StyledSelectablePill>
              ))}
            </StyledPillsContainer>
          </StyledFieldGroup>

          {/* Organization Roles */}
          {selectedContexts.includes('IN_HOUSE') && (
            <StyledFieldGroup>
              <StyledLabel>Organization Roles</StyledLabel>
              <StyledPillsContainer>
                {AVAILABLE_ROLES.map((role) => (
                  <StyledSelectablePill
                    key={role.id}
                    type="button"
                    isSelected={selectedRoles.includes(role.id)}
                    onClick={() => toggleRole(role.id)}
                  >
                    {selectedRoles.includes(role.id) && <IconCheck size={12} />}
                    <span>{role.label}</span>
                  </StyledSelectablePill>
                ))}
              </StyledPillsContainer>
            </StyledFieldGroup>
          )}

          {/* Conditional In-House Employment Section */}
          {selectedContexts.includes('IN_HOUSE') && (
            <>
              <StyledSectionDivider>
                <StyledDividerLabel>Employment Relationship</StyledDividerLabel>
              </StyledSectionDivider>
              <StyledRow>
                <StyledFieldGroup>
                  <StyledLabel>Department</StyledLabel>
                  <StyledSelect
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Sales & BD">Sales & BD</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </StyledSelect>
                </StyledFieldGroup>
                <StyledFieldGroup>
                  <StyledLabel>Designation</StyledLabel>
                  <StyledInput
                    placeholder="e.g. Senior Software Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </StyledFieldGroup>
              </StyledRow>
              <StyledFieldGroup>
                <StyledLabel>Reporting Manager</StyledLabel>
                <StyledSelect
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                >
                  <option value="">No Manager / Executive</option>
                  {inHouseManagers.map((m) => (
                    <option key={m.id} value={m.employment?.id}>
                      {m.name} ({m.employment?.designation})
                    </option>
                  ))}
                </StyledSelect>
              </StyledFieldGroup>
            </>
          )}

          {/* Conditional Candidate Profile Section */}
          {selectedContexts.includes('CANDIDATE') && (
            <>
              <StyledSectionDivider>
                <StyledDividerLabel>Candidate Profile</StyledDividerLabel>
              </StyledSectionDivider>
              <StyledRow>
                <StyledFieldGroup>
                  <StyledLabel>Experience (Years)</StyledLabel>
                  <StyledInput
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </StyledFieldGroup>
                <StyledFieldGroup>
                  <StyledLabel>Expected Salary (Annual)</StyledLabel>
                  <StyledInput
                    placeholder="e.g. ₹28,00,000"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                  />
                </StyledFieldGroup>
              </StyledRow>
              <StyledFieldGroup>
                <StyledLabel>Technical Skills (comma separated)</StyledLabel>
                <StyledInput
                  placeholder="e.g. React, Node.js, PostgreSQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </StyledFieldGroup>
            </>
          )}

          {/* Conditional Contact Section */}
          {selectedContexts.includes('CONTACT') && (
            <>
              <StyledSectionDivider>
                <StyledDividerLabel>Client Relationship</StyledDividerLabel>
              </StyledSectionDivider>
              <StyledFieldGroup>
                <StyledLabel>Company Name</StyledLabel>
                <StyledInput
                  placeholder="e.g. Acme Technologies"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </StyledFieldGroup>
            </>
          )}

          <StyledModalFooter>
            <StyledButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </StyledButton>
            <StyledButton type="submit" variant="primary">
              Create Person Record
            </StyledButton>
          </StyledModalFooter>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};
