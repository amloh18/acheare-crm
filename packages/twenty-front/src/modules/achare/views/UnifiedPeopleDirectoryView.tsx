import { useState, useMemo, useEffect } from 'react';
import { styled } from '@linaria/react';
import { useSearchParams } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconSearch,
  IconPlus,
  IconMail,
  IconPhone,
  IconBuildingSkyscraper,
  IconBriefcase,
  IconUsers,
  IconUserPlus,
  IconLayoutGrid,
  IconTable,
  IconHierarchy,
  IconCheck,
  IconArrowRight,
} from 'twenty-ui/icon';

import { UnifiedPerson, PersonContext, OrganizationRole } from '../types/acharePeople';
import { useUnifiedPeople } from '../hooks/useUnifiedPeople';
import { AddPersonModal } from '../components/AddPersonModal';
import { PersonProfileModal } from '../components/PersonProfileModal';
import { OrgChartView } from './OrgChartView';

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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSubHeading = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  flex-wrap: wrap;
`;

const StyledSearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: 6px 12px;
  width: 240px;
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

const StyledViewSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  padding: 2px;
  border-radius: ${themeCssVariables.border.radius.sm};
`;

const StyledViewBtn = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 5px 8px;
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.background.primary : 'transparent'};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: ${({ isActive }) =>
    isActive ? '0 1px 3px rgba(0, 0, 0, 0.06)' : 'none'};

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledContextBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding-bottom: ${themeCssVariables.spacing[2]};
  overflow-x: auto;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTabGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledContextTab = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  cursor: pointer;
  border: 1px solid
    ${({ isActive }) =>
      isActive
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.light};
  background: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.background.primary};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.secondary};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTabCount = styled.span<{ isActive: boolean }>`
  display: inline-flex;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${({ isActive }) =>
    isActive ? 'rgba(255, 255, 255, 0.25)' : themeCssVariables.background.secondary};
  color: ${({ isActive }) =>
    isActive ? '#ffffff' : themeCssVariables.font.color.secondary};
`;

const StyledRoleChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
`;

const StyledRoleChip = styled.button<{ isActive: boolean }>`
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid
    ${({ isActive }) =>
      isActive
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.light};
  background: ${({ isActive }) =>
    isActive
      ? themeCssVariables.background.tertiary
      : themeCssVariables.background.primary};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
    transform: translateY(-1px);
  }
`;

const StyledCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledAvatar = styled.div<{ bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledHeadline = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledBadgesWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`;

const StyledBadge = styled.span<{ variant?: 'inHouse' | 'candidate' | 'contact' | 'role' }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 10px;
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

const StyledDetailsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.secondary};
  padding: ${themeCssVariables.spacing[2]} 0;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  overflow: hidden;

  th {
    text-align: left;
    padding: 10px 14px;
    background: ${themeCssVariables.background.secondary};
    border-bottom: 1px solid ${themeCssVariables.border.color.medium};
    color: ${themeCssVariables.font.color.tertiary};
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid ${themeCssVariables.border.color.light};
    font-size: 0.8125rem;
    color: ${themeCssVariables.font.color.primary};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: ${themeCssVariables.background.secondary};
    cursor: pointer;
  }
`;

type FilterContextTab = 'ALL' | 'IN_HOUSE' | 'CANDIDATE' | 'CONTACT' | 'CONTRACTOR';

interface UnifiedPeopleDirectoryViewProps {
  defaultContext?: PersonContext;
}

export const UnifiedPeopleDirectoryView = ({
  defaultContext,
}: UnifiedPeopleDirectoryViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { people, counts } = useUnifiedPeople();

  // Read context filter from URL params or defaultContext
  const contextParam = searchParams.get('context') as FilterContextTab | null;
  const initialTab: FilterContextTab =
    contextParam && ['IN_HOUSE', 'CANDIDATE', 'CONTACT', 'CONTRACTOR'].includes(contextParam)
      ? contextParam
      : defaultContext || 'ALL';

  const [activeTab, setActiveTab] = useState<FilterContextTab>(initialTab);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'orgChart'>('grid');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<UnifiedPerson | null>(null);

  // Sync tab state when URL changes
  useEffect(() => {
    if (contextParam && ['IN_HOUSE', 'CANDIDATE', 'CONTACT', 'CONTRACTOR'].includes(contextParam)) {
      setActiveTab(contextParam as FilterContextTab);
    }
  }, [contextParam]);

  const handleTabChange = (tab: FilterContextTab) => {
    setActiveTab(tab);
    if (tab === 'ALL') {
      searchParams.delete('context');
    } else {
      searchParams.set('context', tab);
    }
    setSearchParams(searchParams);
  };

  // Filter people based on context, role, and search query
  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      // 1. Context Filter
      if (activeTab === 'IN_HOUSE') {
        const isInHouse = person.inHouse || person.contexts.includes('IN_HOUSE') || Boolean(person.employment);
        if (!isInHouse) return false;
      } else if (activeTab === 'CANDIDATE') {
        const isCandidate = person.contexts.includes('CANDIDATE') || Boolean(person.candidateProfile);
        if (!isCandidate) return false;
      } else if (activeTab === 'CONTACT') {
        const isContact = person.contexts.includes('CONTACT') || Boolean(person.companyRelationship);
        if (!isContact) return false;
      } else if (activeTab === 'CONTRACTOR') {
        if (!person.contexts.includes('CONTRACTOR')) return false;
      }

      // 2. Role Filter
      if (selectedRole !== 'ALL') {
        if (selectedRole === 'FORMER') {
          if (person.status !== 'FORMER') return false;
        } else {
          if (!person.roles.includes(selectedRole as OrganizationRole)) return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = person.name.toLowerCase().includes(q);
        const matchesEmail = person.email.toLowerCase().includes(q);
        const matchesPhone = person.phone.toLowerCase().includes(q);
        const matchesCity = person.city.toLowerCase().includes(q);
        const matchesHeadline = person.headline?.toLowerCase().includes(q);
        const matchesCompany = person.companyRelationship?.companyName.toLowerCase().includes(q);
        const matchesDept = person.employment?.department.toLowerCase().includes(q);
        const matchesSkills = person.candidateProfile?.skills.some((s) => s.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesCity &&
          !matchesHeadline &&
          !matchesCompany &&
          !matchesDept &&
          !matchesSkills
        ) {
          return false;
        }
      }

      return true;
    });
  }, [people, activeTab, selectedRole, searchQuery]);

  return (
    <StyledContainer>
      {/* Header Row */}
      <StyledHeaderRow>
        <StyledHeaderTitle>
          <StyledMainHeading>
            <span>Master People Directory</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: themeCssVariables.font.color.tertiary }}>
              ({filteredPeople.length} of {people.length})
            </span>
          </StyledMainHeading>
          <StyledSubHeading>
            Canonical human records unified across Team, Candidates, Contacts & Contractors
          </StyledSubHeading>
        </StyledHeaderTitle>

        <StyledControls>
          <StyledSearchWrap>
            <IconSearch size={14} />
            <StyledSearchInput
              placeholder="Search by name, email, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </StyledSearchWrap>

          <StyledViewSwitcher>
            <StyledViewBtn
              isActive={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <IconLayoutGrid size={14} />
            </StyledViewBtn>
            <StyledViewBtn
              isActive={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              title="Table View"
            >
              <IconTable size={14} />
            </StyledViewBtn>
            <StyledViewBtn
              isActive={viewMode === 'orgChart'}
              onClick={() => setViewMode('orgChart')}
              title="Org Chart"
            >
              <IconHierarchy size={14} />
            </StyledViewBtn>
          </StyledViewSwitcher>

          <StyledButton
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <IconPlus size={14} />
            <span>Add Person</span>
          </StyledButton>
        </StyledControls>
      </StyledHeaderRow>

      {/* Primary Context Switcher Bar */}
      <StyledContextBar>
        <StyledTabGroup>
          <StyledContextTab
            isActive={activeTab === 'ALL'}
            onClick={() => handleTabChange('ALL')}
          >
            <span>All People</span>
            <StyledTabCount isActive={activeTab === 'ALL'}>
              {counts.total}
            </StyledTabCount>
          </StyledContextTab>

          <StyledContextTab
            isActive={activeTab === 'IN_HOUSE'}
            onClick={() => handleTabChange('IN_HOUSE')}
          >
            <IconUsers size={13} />
            <span>Team (In-house)</span>
            <StyledTabCount isActive={activeTab === 'IN_HOUSE'}>
              {counts.team}
            </StyledTabCount>
          </StyledContextTab>

          <StyledContextTab
            isActive={activeTab === 'CANDIDATE'}
            onClick={() => handleTabChange('CANDIDATE')}
          >
            <IconUserPlus size={13} />
            <span>Candidates</span>
            <StyledTabCount isActive={activeTab === 'CANDIDATE'}>
              {counts.candidates}
            </StyledTabCount>
          </StyledContextTab>

          <StyledContextTab
            isActive={activeTab === 'CONTACT'}
            onClick={() => handleTabChange('CONTACT')}
          >
            <IconBuildingSkyscraper size={13} />
            <span>Client Contacts</span>
            <StyledTabCount isActive={activeTab === 'CONTACT'}>
              {counts.contacts}
            </StyledTabCount>
          </StyledContextTab>

          <StyledContextTab
            isActive={activeTab === 'CONTRACTOR'}
            onClick={() => handleTabChange('CONTRACTOR')}
          >
            <IconBriefcase size={13} />
            <span>Contractors</span>
            <StyledTabCount isActive={activeTab === 'CONTRACTOR'}>
              {counts.contractors}
            </StyledTabCount>
          </StyledContextTab>
        </StyledTabGroup>
      </StyledContextBar>

      {/* Secondary Role Filter Chips */}
      <StyledRoleChipsRow>
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: themeCssVariables.font.color.tertiary, textTransform: 'uppercase' }}>
          Role Filter:
        </span>
        {['ALL', 'ADMIN', 'RECRUITER', 'BDE', 'HR', 'MANAGER', 'EMPLOYEE', 'FORMER'].map((role) => (
          <StyledRoleChip
            key={role}
            isActive={selectedRole === role}
            onClick={() => setSelectedRole(role)}
          >
            {role === 'ALL' ? 'All Roles' : role}
          </StyledRoleChip>
        ))}
      </StyledRoleChipsRow>

      {/* VIEW RENDERING */}
      {viewMode === 'orgChart' ? (
        <OrgChartView
          people={people}
          onSelectPerson={(p) => setSelectedPerson(p)}
        />
      ) : viewMode === 'list' ? (
        <StyledTable>
          <thead>
            <tr>
              <th>Person Name</th>
              <th>Contexts</th>
              <th>Organization Roles</th>
              <th>Department / Company</th>
              <th>Contact Info</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person) => (
              <tr key={person.id} onClick={() => setSelectedPerson(person)}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: person.avatarBg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {person.initials}
                    </div>
                    <span>{person.name}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {person.contexts.map((ctx) => (
                      <StyledBadge key={ctx} variant={ctx === 'IN_HOUSE' ? 'inHouse' : ctx === 'CANDIDATE' ? 'candidate' : 'contact'}>
                        {ctx}
                      </StyledBadge>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {person.roles.map((r) => (
                      <StyledBadge key={r} variant="role">
                        {r}
                      </StyledBadge>
                    ))}
                  </div>
                </td>
                <td>
                  {person.employment?.department ||
                    person.companyRelationship?.companyName ||
                    '—'}
                </td>
                <td>
                  <div>{person.email}</div>
                </td>
                <td>{person.city}</td>
                <td>
                  <StyledBadge variant="inHouse">{person.status}</StyledBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      ) : (
        /* Grid / Card View */
        <StyledGrid>
          {filteredPeople.map((person) => (
            <StyledCard
              key={person.id}
              onClick={() => setSelectedPerson(person)}
            >
              <StyledCardTop>
                <StyledAvatar bg={person.avatarBg}>
                  {person.initials}
                </StyledAvatar>
                <StyledInfo>
                  <StyledName>{person.name}</StyledName>
                  <StyledHeadline>{person.headline || person.city}</StyledHeadline>
                  <StyledBadgesWrap>
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
                          ? 'Team'
                          : ctx === 'CANDIDATE'
                          ? 'Candidate'
                          : ctx === 'CONTACT'
                          ? 'Contact'
                          : 'Contractor'}
                      </StyledBadge>
                    ))}
                    {person.roles.map((r) => (
                      <StyledBadge key={r} variant="role">
                        {r}
                      </StyledBadge>
                    ))}
                  </StyledBadgesWrap>
                </StyledInfo>
              </StyledCardTop>

              <StyledDetailsRow>
                <StyledDetailItem>
                  <IconMail size={12} />
                  <span>{person.email}</span>
                </StyledDetailItem>
                <StyledDetailItem>
                  <IconPhone size={12} />
                  <span>{person.phone}</span>
                </StyledDetailItem>
                {person.employment && (
                  <StyledDetailItem>
                    <IconBriefcase size={12} />
                    <span>
                      {person.employment.designation} · {person.employment.department}
                    </span>
                  </StyledDetailItem>
                )}
                {person.companyRelationship && (
                  <StyledDetailItem>
                    <IconBuildingSkyscraper size={12} />
                    <span>{person.companyRelationship.companyName}</span>
                  </StyledDetailItem>
                )}
              </StyledDetailsRow>

              <StyledCardFooter>
                <span style={{ color: themeCssVariables.font.color.tertiary, fontSize: '0.6875rem' }}>
                  {person.city}
                </span>
                <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.75rem' }}>
                  ● {person.status}
                </span>
              </StyledCardFooter>
            </StyledCard>
          ))}
        </StyledGrid>
      )}

      {/* Add Person Modal with Duplicate Prevention */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultContext={activeTab === 'ALL' ? 'IN_HOUSE' : (activeTab as PersonContext)}
      />

      {/* Universal Dynamic Person Profile Modal */}
      <PersonProfileModal
        person={selectedPerson}
        isOpen={Boolean(selectedPerson)}
        onClose={() => setSelectedPerson(null)}
      />
    </StyledContainer>
  );
};
