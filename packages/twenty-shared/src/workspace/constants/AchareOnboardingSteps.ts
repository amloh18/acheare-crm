import { AppPath } from '../../types/AppPath';
import { AchareModuleKey } from '../types/AchareModuleKey';

/**
 * Keys of the Achare onboarding steps — the single step vocabulary shared by
 * the server (persisted step, `AchareSetupStep`) and the frontend (routing
 * `OnboardingStatus`, `AppPath`).
 *
 * The fixed steps always appear; module setup steps are generated from the
 * workspace's enabled features, so a workspace that did not select Recruitment
 * never sees a Recruitment step.
 *
 * Step names are deliberately the names the server already persists, so this
 * vocabulary replaced the old duplicate one without a data migration.
 */
export type AchareOnboardingStepKey =
  | 'WELCOME'
  | 'BASIC_SETUP'
  | 'SETUP_CHOICE'
  | 'FEATURE_SELECTION'
  | 'AGENCY'
  | 'TEAM'
  | 'CRM_IMPORT'
  | 'RECRUITMENT'
  | 'HR'
  | 'PAYROLL'
  | 'DASHBOARD'
  | 'FINANCE'
  | 'DOCUMENTS'
  | 'REVIEW';

/** Fixed steps that always appear, in order, at the start. */
export const ACHARE_ONBOARDING_LEADING_STEPS: AchareOnboardingStepKey[] = [
  'WELCOME',
  'BASIC_SETUP',
  'SETUP_CHOICE',
  'FEATURE_SELECTION',
  'AGENCY',
];

/** Fixed steps that always appear at the end. */
export const ACHARE_ONBOARDING_TRAILING_STEPS: AchareOnboardingStepKey[] = [
  'REVIEW',
];

/**
 * Maps a module to the onboarding step that configures it.
 *
 * Modules without an entry (e.g. Collaboration) are configured inline rather
 * than receiving a dedicated step.
 */
export const ACHARE_MODULE_ONBOARDING_STEP: Partial<
  Record<AchareModuleKey, AchareOnboardingStepKey>
> = {
  [AchareModuleKey.TEAM]: 'TEAM',
  [AchareModuleKey.CRM]: 'CRM_IMPORT',
  [AchareModuleKey.RECRUITMENT]: 'RECRUITMENT',
  [AchareModuleKey.HR]: 'HR',
  [AchareModuleKey.PAYROLL]: 'PAYROLL',
  [AchareModuleKey.FINANCE]: 'FINANCE',
  [AchareModuleKey.DOCUMENTS]: 'DOCUMENTS',
  [AchareModuleKey.ANALYTICS]: 'DASHBOARD',
};

/**
 * Order in which module setup steps appear when several modules are enabled.
 * TEAM comes before CRM so employees exist before module-specific setup.
 */
export const ACHARE_MODULE_ONBOARDING_STEP_ORDER: AchareModuleKey[] = [
  AchareModuleKey.TEAM,
  AchareModuleKey.CRM,
  AchareModuleKey.RECRUITMENT,
  AchareModuleKey.HR,
  AchareModuleKey.PAYROLL,
  AchareModuleKey.FINANCE,
  AchareModuleKey.DOCUMENTS,
  AchareModuleKey.ANALYTICS,
];

/**
 * The `OnboardingStatus` each step routes to. Declared as literal strings so
 * both the server enum and the generated frontend enum can be checked against
 * it without either side importing the other.
 */
export const ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS: Record<
  AchareOnboardingStepKey,
  string
> = {
  WELCOME: 'ACHARE_WELCOME',
  BASIC_SETUP: 'ACHARE_BASIC_SETUP',
  SETUP_CHOICE: 'ACHARE_SETUP_CHOICE',
  FEATURE_SELECTION: 'ACHARE_FEATURE_SELECTION',
  AGENCY: 'ACHARE_AGENCY',
  TEAM: 'ACHARE_TEAM',
  CRM_IMPORT: 'ACHARE_CRM_IMPORT',
  RECRUITMENT: 'ACHARE_RECRUITMENT',
  HR: 'ACHARE_HR',
  PAYROLL: 'ACHARE_PAYROLL',
  DASHBOARD: 'ACHARE_DASHBOARD',
  FINANCE: 'ACHARE_FINANCE',
  DOCUMENTS: 'ACHARE_DOCUMENTS',
  REVIEW: 'ACHARE_REVIEW',
};

/**
 * Short human-readable label for each step, used by feature selection to
 * preview the wizard a workspace will get, and later by the Setup Center.
 */
export const ACHARE_ONBOARDING_STEP_LABEL: Record<
  AchareOnboardingStepKey,
  string
> = {
  WELCOME: 'Welcome',
  BASIC_SETUP: 'Agency details',
  SETUP_CHOICE: 'Setup mode',
  FEATURE_SELECTION: 'Modules',
  AGENCY: 'Agency profile',
  TEAM: 'Team',
  CRM_IMPORT: 'Import data',
  RECRUITMENT: 'Recruitment',
  HR: 'HR',
  PAYROLL: 'Payroll',
  DASHBOARD: 'Dashboards',
  FINANCE: 'Finance',
  DOCUMENTS: 'Documents',
  REVIEW: 'Review',
};

/** The route each step renders at. */
export const ACHARE_ONBOARDING_STEP_APP_PATH: Record<
  AchareOnboardingStepKey,
  AppPath
> = {  WELCOME: AppPath.AchareWelcome,
  BASIC_SETUP: AppPath.AchareBasicSetup,
  SETUP_CHOICE: AppPath.AchareSetupChoice,
  FEATURE_SELECTION: AppPath.AchareFeatureSelection,
  AGENCY: AppPath.AchareAgency,
  TEAM: AppPath.AchareTeam,
  CRM_IMPORT: AppPath.AchareCrmImport,
  RECRUITMENT: AppPath.AchareRecruitment,
  HR: AppPath.AchareHr,
  PAYROLL: AppPath.AcharePayroll,
  DASHBOARD: AppPath.AchareDashboard,
  FINANCE: AppPath.AchareFinance,
  DOCUMENTS: AppPath.AchareDocuments,
  REVIEW: AppPath.AchareReview,
};

/**
 * Reverse lookup: `OnboardingStatus` value → step. Built once so the frontend
 * never has to hand-maintain a status→step table.
 */
export const ACHARE_ONBOARDING_STATUS_TO_STEP: Record<
  string,
  AchareOnboardingStepKey
> = Object.entries(ACHARE_ONBOARDING_STEP_ONBOARDING_STATUS).reduce(
  (accumulator, [step, status]) => ({
    ...accumulator,
    [status]: step as AchareOnboardingStepKey,
  }),
  {},
);

/** The steps that configure a module (as opposed to the fixed steps). */
export const ACHARE_MODULE_ONBOARDING_STEPS: AchareOnboardingStepKey[] =
  ACHARE_MODULE_ONBOARDING_STEP_ORDER.map(
    (moduleKey) => ACHARE_MODULE_ONBOARDING_STEP[moduleKey],
  ).filter((step): step is AchareOnboardingStepKey => step !== undefined);
