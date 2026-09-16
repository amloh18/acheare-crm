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
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledCardTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-top: ${themeCssVariables.spacing[1]};
`;

const StyledFeatureLink = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[1]};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[1]} 0;
  text-align: left;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    color: ${themeCssVariables.font.color.tertiary};
    cursor: default;
  }
`;

const StyledImportRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledImportButton = styled.button`
  align-items: center;
  background: none;
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};

  &:hover {
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    color: ${themeCssVariables.font.color.tertiary};
    cursor: default;
  }
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
            <StyledCardTitle>{section.title}</StyledCardTitle>
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
                  disabled={objectNamePlural === undefined}
                  onClick={() => {
                    if (objectNamePlural !== undefined) {
                      handleOpenObject(objectNamePlural);
                    }
                  }}
                >
                  {featureLabel}
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
            <StyledImportRow>
              {section.features
                .filter(
                  (feature) =>
                    objectNameSingularByFeature[feature] !== undefined,
                )
                .map((feature) => (
                  <StyledImportButton
                    key={feature}
                    type="button"
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
                    {t`Import ${ACHARE_FEATURES[feature].label}`}
                  </StyledImportButton>
                ))}
            </StyledImportRow>
          )}
        </StyledCard>
      ))}
    </StyledGrid>
  );
};
