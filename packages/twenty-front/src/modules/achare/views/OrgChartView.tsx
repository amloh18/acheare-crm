import React from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { UnifiedPerson } from '../types/acharePeople';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${themeCssVariables.spacing[6]};
  padding: ${themeCssVariables.spacing[6]} 0;
  width: 100%;
  overflow-x: auto;
`;

const StyledLevel = styled.div`
  display: flex;
  justify-content: center;
  gap: ${themeCssVariables.spacing[4]};
  position: relative;
  flex-wrap: wrap;
`;

const StyledOrgCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  width: 240px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const StyledAvatar = styled.div<{ bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledRole = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledDeptBadge = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  font-weight: 600;
`;

const StyledConnectingLine = styled.div`
  width: 2px;
  height: 24px;
  background: ${themeCssVariables.border.color.medium};
  margin: 0 auto;
`;

interface OrgChartViewProps {
  people: UnifiedPerson[];
  onSelectPerson: (person: UnifiedPerson) => void;
}

export const OrgChartView = ({
  people,
  onSelectPerson,
}: OrgChartViewProps) => {
  // Only display in-house team members with active employment
  const team = people.filter((p) => p.inHouse && p.employment);

  // Identify root managers (those without managerId or managers at top level)
  const rootManagers = team.filter((p) => !p.employment?.managerId);
  const reportsMap = new Map<string, UnifiedPerson[]>();

  team.forEach((p) => {
    if (p.employment?.managerId) {
      const reports = reportsMap.get(p.employment.managerId) || [];
      reports.push(p);
      reportsMap.set(p.employment.managerId, reports);
    }
  });

  return (
    <StyledContainer>
      <div style={{ fontSize: '0.8125rem', color: themeCssVariables.font.color.tertiary, marginBottom: 8 }}>
        Visual Hierarchy derived from Active Employment & Manager Relationships
      </div>

      {/* Level 1: Executive & Department Leads */}
      <StyledLevel>
        {rootManagers.map((leader) => (
          <div key={leader.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StyledOrgCard onClick={() => onSelectPerson(leader)}>
              <StyledAvatar bg={leader.avatarBg}>{leader.initials}</StyledAvatar>
              <StyledInfo>
                <StyledName>{leader.name}</StyledName>
                <StyledRole>{leader.employment?.designation}</StyledRole>
                <StyledDeptBadge>{leader.employment?.department}</StyledDeptBadge>
              </StyledInfo>
            </StyledOrgCard>

            {/* Direct reports to this leader */}
            {leader.employment?.id && reportsMap.has(leader.employment.id) && (
              <>
                <StyledConnectingLine />
                <StyledLevel>
                  {reportsMap.get(leader.employment.id)?.map((report) => (
                    <div key={report.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <StyledOrgCard onClick={() => onSelectPerson(report)}>
                        <StyledAvatar bg={report.avatarBg}>{report.initials}</StyledAvatar>
                        <StyledInfo>
                          <StyledName>{report.name}</StyledName>
                          <StyledRole>{report.employment?.designation}</StyledRole>
                          <StyledDeptBadge>{report.employment?.department}</StyledDeptBadge>
                        </StyledInfo>
                      </StyledOrgCard>

                      {/* Sub-reports */}
                      {report.employment?.id && reportsMap.has(report.employment.id) && (
                        <>
                          <StyledConnectingLine />
                          <StyledLevel>
                            {reportsMap.get(report.employment.id)?.map((subReport) => (
                              <StyledOrgCard key={subReport.id} onClick={() => onSelectPerson(subReport)}>
                                <StyledAvatar bg={subReport.avatarBg}>{subReport.initials}</StyledAvatar>
                                <StyledInfo>
                                  <StyledName>{subReport.name}</StyledName>
                                  <StyledRole>{subReport.employment?.designation}</StyledRole>
                                  <StyledDeptBadge>{subReport.employment?.department}</StyledDeptBadge>
                                </StyledInfo>
                              </StyledOrgCard>
                            ))}
                          </StyledLevel>
                        </>
                      )}
                    </div>
                  ))}
                </StyledLevel>
              </>
            )}
          </div>
        ))}
      </StyledLevel>
    </StyledContainer>
  );
};
