import { type AchareOnboardingStepKey } from 'twenty-shared/workspace';

export enum AchareSetupStepKeys {
  ACHARE_SETUP_STATUS = 'ACHARE_SETUP_STATUS',
  ACHARE_SETUP_MODE = 'ACHARE_SETUP_MODE',
  ACHARE_SETUP_CURRENT_STEP = 'ACHARE_SETUP_CURRENT_STEP',
  ACHARE_BASIC_SETUP_COMPLETED = 'ACHARE_BASIC_SETUP_COMPLETED',
  ACHARE_SETUP_CHOICE_COMPLETED = 'ACHARE_SETUP_CHOICE_COMPLETED',
  ACHARE_FEATURE_SELECTION_COMPLETED = 'ACHARE_FEATURE_SELECTION_COMPLETED',
  ACHARE_AGENCY_COMPLETED = 'ACHARE_AGENCY_COMPLETED',
  ACHARE_TEAM_COMPLETED = 'ACHARE_TEAM_COMPLETED',
  ACHARE_CRM_IMPORT_COMPLETED = 'ACHARE_CRM_IMPORT_COMPLETED',
  ACHARE_RECRUITMENT_COMPLETED = 'ACHARE_RECRUITMENT_COMPLETED',
  ACHARE_HR_COMPLETED = 'ACHARE_HR_COMPLETED',
  ACHARE_HR_SKIPPED = 'ACHARE_HR_SKIPPED',
  ACHARE_PAYROLL_COMPLETED = 'ACHARE_PAYROLL_COMPLETED',
  ACHARE_PAYROLL_SKIPPED = 'ACHARE_PAYROLL_SKIPPED',
  ACHARE_FINANCE_COMPLETED = 'ACHARE_FINANCE_COMPLETED',
  ACHARE_FINANCE_SKIPPED = 'ACHARE_FINANCE_SKIPPED',
  ACHARE_DOCUMENTS_COMPLETED = 'ACHARE_DOCUMENTS_COMPLETED',
  ACHARE_DOCUMENTS_SKIPPED = 'ACHARE_DOCUMENTS_SKIPPED',
  ACHARE_DASHBOARD_COMPLETED = 'ACHARE_DASHBOARD_COMPLETED',
  ACHARE_SETUP_COMPLETED_AT = 'ACHARE_SETUP_COMPLETED_AT',
  ACHARE_SETUP_VERSION = 'ACHARE_SETUP_VERSION',
}

export type AchareSetupStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type AchareSetupMode = 'GUIDED' | 'MANUAL';

/**
 * The persisted onboarding step.
 *
 * This is the shared `AchareOnboardingStepKey` — deliberately the same
 * vocabulary the frontend routes on, so there is exactly one step vocabulary
 * rather than a server one and a frontend one that must be kept in sync.
 *
 * The step *order* is no longer a constant: it is generated per workspace from
 * the enabled features (`getAchareOnboardingSteps`), exposed through
 * `WorkspaceFeatureService.getOnboardingSteps`. A workspace that did not select
 * Recruitment never sees a Recruitment step, so a fixed order cannot describe
 * the wizard any more.
 */
export type AchareSetupStep = AchareOnboardingStepKey;

export const ACHARE_SETUP_CURRENT_VERSION = 2;
