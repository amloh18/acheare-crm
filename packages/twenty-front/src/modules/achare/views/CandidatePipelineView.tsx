import { useState, useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconSearch,
  IconPlus,
  IconChevronRight,
  IconCheck,
  IconBriefcase,
  IconCoins,
  IconUserPlus,
} from 'twenty-ui/icon';
import { useUnifiedPeople } from '../hooks/useUnifiedPeople';
import { UnifiedPerson } from '../types/acharePeople';
import { PersonProfileModal } from '../components/PersonProfileModal';
import { AddPersonModal } from '../components/AddPersonModal';

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

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
  align-items: start;
  overflow-x: auto;
  padding-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledColumn = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  min-height: 480px;
`;

const StyledColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${themeCssVariables.spacing[2]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledColumnTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledColumnTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StyledColumnCount = styled.span`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 12px;
  padding: 1px 7px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledCandidateCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);
    border-color: ${themeCssVariables.border.color.medium};
  }
`;

const StyledCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const StyledCandidateName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledCandidateRole = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledSkillsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const StyledSkillPill = styled.span`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 3px;
  padding: 1px 6px;
  font-size: 0.6875rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledCardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${themeCssVariables.spacing[1]};
  border-top: 1px dashed ${themeCssVariables.border.color.light};
`;

const StyledMoveButton = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  border-radius: 3px;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
    background: ${themeCssVariables.background.secondary};
  }
`;

const STAGES = [
  { key: 'APPLIED', label: 'Applied', color: '#94a3b8' },
  { key: 'SCREENING', label: 'Screening', color: '#38bdf8' },
  { key: 'INTERVIEW', label: 'Interview', color: '#f59e0b' },
  { key: 'OFFER', label: 'Offer', color: '#ec4899' },
  { key: 'HIRED', label: 'Hired (Team)', color: '#10b981' },
];

export const CandidatePipelineView = () => {
  const { people, updatePerson } = useUnifiedPeople();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<UnifiedPerson | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Extract all candidates and their applications from the canonical People directory
  const candidateList = useMemo(() => {
    return people.filter(
      (p) => p.contexts.includes('CANDIDATE') || Boolean(p.candidateProfile),
    );
  }, [people]);

  const handleAdvanceCandidate = (
    person: UnifiedPerson,
    currentStage: string,
  ) => {
    const stageKeys = STAGES.map((s) => s.key);
    const normalizedStage = currentStage === 'JOINED' ? 'HIRED' : currentStage;
    const currentIndex = stageKeys.indexOf(normalizedStage);

    if (currentIndex < stageKeys.length - 1) {
      const nextStage = stageKeys[currentIndex + 1];
      if (person.candidateProfile) {
        const updatedApplications = person.candidateProfile.applications.map(
          (app, idx) => (idx === 0 ? { ...app, stage: nextStage as any } : app),
        );
        updatePerson(person.id, {
          candidateProfile: {
            ...person.candidateProfile,
            applications: updatedApplications,
          },
        });
      }
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidateList.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesName = c.name.toLowerCase().includes(q);
      const matchesRole = c.headline?.toLowerCase().includes(q) || false;
      const matchesSkills =
        c.candidateProfile?.skills.some((s) => s.toLowerCase().includes(q)) ||
        false;
      return matchesName || matchesRole || matchesSkills;
    });
  }, [candidateList, searchQuery]);

  return (
    <StyledContainer>
      <StyledHeaderRow>
        <StyledHeaderTitle>
          <StyledMainHeading>Recruitment & Applications Pipeline</StyledMainHeading>
          <StyledSubHeading>
            Managing candidates and job submissions mapped to canonical People records
          </StyledSubHeading>
        </StyledHeaderTitle>

        <StyledControls>
          <StyledSearchWrap>
            <IconSearch size={14} />
            <StyledSearchInput
              placeholder="Search candidate, role, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </StyledSearchWrap>
          <StyledButton variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <IconPlus size={14} />
            <span>Add Candidate</span>
          </StyledButton>
        </StyledControls>
      </StyledHeaderRow>

      <StyledBoard>
        {STAGES.map((stageObj) => {
          const stagePeople = filteredCandidates.filter((person) => {
            const primaryApp = person.candidateProfile?.applications[0];
            const currentStage = primaryApp?.stage || 'APPLIED';
            return currentStage === stageObj.key;
          });

          return (
            <StyledColumn key={stageObj.key}>
              <StyledColumnHeader>
                <StyledColumnTitleWrap>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: stageObj.color,
                    }}
                  />
                  <StyledColumnTitle>{stageObj.label}</StyledColumnTitle>
                </StyledColumnTitleWrap>
                <StyledColumnCount>{stagePeople.length}</StyledColumnCount>
              </StyledColumnHeader>

              <StyledCardList>
                {stagePeople.map((person) => {
                  const profile = person.candidateProfile;
                  const app = profile?.applications[0];

                  return (
                    <StyledCandidateCard
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                    >
                      <StyledCardTop>
                        <div>
                          <StyledCandidateName>{person.name}</StyledCandidateName>
                          <StyledCandidateRole>
                            {app?.jobTitle || person.headline || 'Applicant'}
                          </StyledCandidateRole>
                        </div>
                        {person.inHouse && (
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              background: '#dbeafe',
                              color: '#1e40af',
                              padding: '1px 5px',
                              borderRadius: 8,
                            }}
                          >
                            Team
                          </span>
                        )}
                      </StyledCardTop>

                      <StyledMetaRow>
                        <span>{profile?.totalExperienceYears || 3} yrs exp</span>
                        <span>•</span>
                        <span>{profile?.expectedSalary || app?.expectedSalary || 'Negotiable'}</span>
                      </StyledMetaRow>

                      {profile?.skills && (
                        <StyledSkillsWrap>
                          {profile.skills.slice(0, 3).map((skill) => (
                            <StyledSkillPill key={skill}>{skill}</StyledSkillPill>
                          ))}
                        </StyledSkillsWrap>
                      )}

                      <StyledCardActions>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            color: themeCssVariables.font.color.tertiary,
                          }}
                        >
                          {person.city}
                        </span>
                        {stageObj.key !== 'HIRED' ? (
                          <StyledMoveButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceCandidate(
                                person,
                                app?.stage || stageObj.key,
                              );
                            }}
                          >
                            <span>Advance</span>
                            <IconChevronRight size={12} />
                          </StyledMoveButton>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              fontWeight: 600,
                            }}
                          >
                            <IconCheck size={12} /> Hired
                          </span>
                        )}
                      </StyledCardActions>
                    </StyledCandidateCard>
                  );
                })}
              </StyledCardList>
            </StyledColumn>
          );
        })}
      </StyledBoard>

      <PersonProfileModal
        person={selectedPerson}
        isOpen={Boolean(selectedPerson)}
        onClose={() => setSelectedPerson(null)}
      />

      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultContext="CANDIDATE"
      />
    </StyledContainer>
  );
};
