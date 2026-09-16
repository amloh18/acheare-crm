import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@linaria/react';
import { ACHARE_FEATURES, AchareFeatureKey } from 'twenty-shared/workspace';
import { AppPath } from 'twenty-shared/types';
import { getAppPath } from 'twenty-shared/utils';
import { IconArrowUpRight, IconFileImport } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

/*
 * Object-backed deep links for the Setup Center's module sections.
 *
 * Keys are standard object names (`standardObjectKey` in the shared feature
 * catalogue), values are singular names for `/objects/:objectNamePlural`
 * routes. Objects absent from this map have no list route and only show
 * feature chips.
 */
const ACHARE_SECTION_OBJECT_LINKS: Partial<Record<AchareFeatureKey, string>> = {
  [AchareFeatureKey.COMPANIES]: 'companies',
  [AchareFeatureKey.CONTACTS]: 'people',
  [AchareFeatureKey.OPPORTUNITIES]: 'opportunities',
  [AchareFeatureKey.REQUIREMENTS]: 'requirements',
  [AchareFeatureKey.CANDIDATES]: 'candidates',
  [AchareFeatureKey.SUBMISSIONS]: 'candidateSubmissions',
  [AchareFeatureKey.INTERVIEWS]: 'interviews',
  [AchareFeatureKey.EMPLOYEES]: 'employees',
  [AchareFeatureKey.DEPARTMENTS]: 'departments',
  [AchareFeatureKey.TEAMS]: 'teams',
  [AchareFeatureKey.DESIGNATIONS]: 'designations',
  [AchareFeatureKey.ONBOARDING]: 'onboardingItems',
  [AchareFeatureKey.ATTENDANCE]: 'attendanceDays',
  [AchareFeatureKey.LEAVE]: 'leaveRequests',
  [AchareFeatureKey.ROSTERS]: 'rosterAssignments',
  [AchareFeatureKey.SHIFTS]: 'shifts',
  [AchareFeatureKey.SALARY]: 'salaryStructures',
  [AchareFeatureKey.PAYROLL]: 'payrollPeriods',
  [AchareFeatureKey.PAYSLIPS]: 'payslips',
  [AchareFeatureKey.PAYROLL_ADJUSTMENTS]: 'payrollAdjustments',
  [AchareFeatureKey.INVOICES]: 'invoices',
  [AchareFeatureKey.PAYMENTS]: 'payments',
  [AchareFeatureKey.DOCUMENTS]: 'attachments',
  [AchareFeatureKey.TASKS]: 'tasks',
  [AchareFeatureKey.NOTES]: 'notes',
  [AchareFeatureKey.DASHBOARDS]: 'dashboards',
};

const StyledGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  height: 100%;
  min-width: 0;
  overflow: hidden;
  padding: ${themeCssVariables.spacing[4]};
  transition: border-color 0.12s ease;

  &:hover {
    border-color: ${themeCssVariables.border.color.medium};
  }
`;

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
  min-width: 0;
`;

const StyledCardTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledFeatureCountBadge = styled.span`
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.xs};
  padding: 1px ${themeCssVariables.spacing[2]};
`;

const StyledFeatureList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledFeatureLink = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
  min-width: 0;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  text-align: left;
  transition: background-color 0.12s ease, color 0.12s ease;
  width: 100%;

  &:hover {
    background: ${themeCssVariables.background.secondary};
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    color: ${themeCssVariables.font.color.tertiary};
    cursor: default;

    &:hover {
      background: none;
    }
  }
`;

const StyledFeatureLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledImportSection = styled.div`
  border-top: 1px dashed ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: auto;
  min-width: 0;
  padding-top: ${themeCssVariables.spacing[3]};
`;

const StyledImportSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const StyledImportButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledImportButton = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.pill};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  max-width: 100%;
  min-width: 0;
  padding: 3px ${themeCssVariables.spacing[2]};
  transition: all 0.12s ease;

  &:hover {
    background: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    color: ${themeCssVariables.font.color.tertiary};
    cursor: default;
    opacity: 0.6;
  }
`;

const StyledImportButtonText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type AchareSetupCenterSection = {
  moduleKey: string;
  title: string;
  features: AchareFeatureKey[];
};

type AchareSetupCenterSectionsProps = {
  sections: AchareSetupCenterSection[];
  onImportClick?: (objectNameSingular: string) => void;
};

/**
 * Feature-aware module sections for the Setup Center.
 *
 * One card per module that has at least one enabled feature. Features whose
 * objects have a list route deep-link to it; object-backed features also get a
 * CSV import entry point that reuses the standard spreadsheet-import dialog.
 *
 * The caller decides which sections exist (typically the workspace's enabled
 * modules) and how imports open, so this component stays a pure view.
 */
export const AchareSetupCenterSections = ({
  sections,
  onImportClick,
}: AchareSetupCenterSectionsProps) => {
  const { t } = useLingui();
  const navigate = useNavigate();

  const objectNamePluralByFeature = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(ACHARE_SECTION_OBJECT_LINKS).map(([feature, name]) => [
          feature,
          name,
        ]),
      ) as Partial<Record<AchareFeatureKey, string>>,
    [],
  );

  const objectNameSingularByFeature = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(ACHARE_FEATURES)
          .filter(
            ([key]) =>
              objectNamePluralByFeature[key as AchareFeatureKey] !== undefined,
          )
          .map(([key, definition]) => [
            key,
            definition.standardObjectKey ?? key,
          ]),
      ) as Partial<Record<AchareFeatureKey, string>>,
    [objectNamePluralByFeature],
  );

  const handleOpenObject = (objectNamePlural: string) => {
    navigate(getAppPath(AppPath.RecordIndexPage, { objectNamePlural }));
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <StyledGrid>
      {sections.map((section) => (
        <StyledCard key={section.moduleKey}>
          <StyledCardHeader>
            <StyledCardTitle title={section.title}>{section.title}</StyledCardTitle>
            <StyledFeatureCountBadge>
              {section.features.length}
            </StyledFeatureCountBadge>
          </StyledCardHeader>
          <StyledFeatureList>
            {section.features.map((feature) => {
              const featureLabel = ACHARE_FEATURES[feature].label;
              const objectNamePlural =
                objectNamePluralByFeature[feature] ?? undefined;
              const objectNameSingular =
                objectNameSingularByFeature[feature] ?? undefined;

              return (
                <StyledFeatureLink
                  key={feature}
                  type="button"
                  title={featureLabel}
                  disabled={objectNamePlural === undefined}
                  onClick={() => {
                    if (objectNamePlural !== undefined) {
                      handleOpenObject(objectNamePlural);
                    }
                  }}
                >
                  <StyledFeatureLabel>{featureLabel}</StyledFeatureLabel>
                  {objectNamePlural !== undefined && (
                    <IconArrowUpRight
                      size={12}
                      color={themeCssVariables.font.color.tertiary}
                    />
                  )}
                </StyledFeatureLink>
              );
            })}
          </StyledFeatureList>
          {section.features.some(
            (feature) => objectNameSingularByFeature[feature] !== undefined,
          ) && (
            <StyledImportSection>
              <StyledImportSectionLabel>{t`Import data`}</StyledImportSectionLabel>
              <StyledImportButtonsContainer>
                {section.features
                  .filter(
                    (feature) =>
                      objectNameSingularByFeature[feature] !== undefined,
                  )
                  .map((feature) => (
                    <StyledImportButton
                      key={feature}
                      type="button"
                      title={t`Import ${ACHARE_FEATURES[feature].label}`}
                      disabled={onImportClick === undefined}
                      onClick={() =>
                        onImportClick?.(
                          objectNameSingularByFeature[feature] as string,
                        )
                      }
                    >
                      <IconFileImport
                        size={12}
                        color={themeCssVariables.font.color.tertiary}
                      />
                      <StyledImportButtonText>
                        {ACHARE_FEATURES[feature].label}
                      </StyledImportButtonText>
                    </StyledImportButton>
                  ))}
              </StyledImportButtonsContainer>
            </StyledImportSection>
          )}
        </StyledCard>
      ))}
    </StyledGrid>
  );
};
