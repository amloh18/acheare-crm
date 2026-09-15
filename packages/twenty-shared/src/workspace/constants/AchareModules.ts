import { AchareFeatureKey } from '../types/AchareFeatureKey';
import { type AchareModuleDefinition } from '../types/AchareModuleDefinition';
import { AchareModuleKey } from '../types/AchareModuleKey';

/**
 * The Achare module catalogue.
 *
 * Modules group features and map to the top-level navigation folders already
 * defined in `standard-navigation-menu-item.constant.ts`. The universal
 * identifiers below must stay in sync with that file's folder UUIDs.
 */
export const ACHARE_MODULES: Record<AchareModuleKey, AchareModuleDefinition> = {
  [AchareModuleKey.CRM]: {
    key: AchareModuleKey.CRM,
    label: 'CRM',
    description: 'Manage customers, contacts and opportunities.',
    icon: 'IconBuildingSkyscraper',
    position: 1,
    navigationFolderUniversalIdentifier: '20202020-d002-4d02-8d02-c0aba11c0002',
    features: [
      AchareFeatureKey.COMPANIES,
      AchareFeatureKey.CONTACTS,
      AchareFeatureKey.OPPORTUNITIES,
    ],
    hasOnboardingStep: true,
    recommendedRoles: ['Sales'],
    recommendedDashboards: ['Sales'],
  },
  [AchareModuleKey.RECRUITMENT]: {
    key: AchareModuleKey.RECRUITMENT,
    label: 'Recruitment',
    description: 'Manage hiring requirements and candidates.',
    icon: 'IconUserSearch',
    position: 2,
    navigationFolderUniversalIdentifier: '20202020-d003-4d03-8d03-c0aba11c0003',
    features: [
      AchareFeatureKey.REQUIREMENTS,
      AchareFeatureKey.CANDIDATES,
      AchareFeatureKey.SUBMISSIONS,
      AchareFeatureKey.INTERVIEWS,
      AchareFeatureKey.PLACEMENTS,
    ],
    hasOnboardingStep: true,
    recommendedRoles: ['Recruiter'],
    recommendedDashboards: ['Recruitment'],
  },
  [AchareModuleKey.TEAM]: {
    key: AchareModuleKey.TEAM,
    label: 'Team',
    description: 'Manage employees, departments and teams.',
    icon: 'IconUsers',
    position: 3,
    navigationFolderUniversalIdentifier: '20202020-d004-4d04-8d04-c0aba11c0004',
    features: [
      AchareFeatureKey.EMPLOYEES,
      AchareFeatureKey.DEPARTMENTS,
      AchareFeatureKey.TEAMS,
      AchareFeatureKey.DESIGNATIONS,
    ],
    hasOnboardingStep: true,
    recommendedRoles: ['HR', 'Manager', 'Employee'],
    recommendedDashboards: ['HR'],
  },
  [AchareModuleKey.HR]: {
    key: AchareModuleKey.HR,
    label: 'HR',
    description: 'Manage attendance, leave, rosters and onboarding.',
    icon: 'IconChecklist',
    position: 4,
    navigationFolderUniversalIdentifier: '20202020-d005-4d05-8d05-c0aba11c0005',
    features: [
      AchareFeatureKey.ONBOARDING,
      AchareFeatureKey.ATTENDANCE,
      AchareFeatureKey.LEAVE,
      AchareFeatureKey.ROSTERS,
      AchareFeatureKey.SHIFTS,
    ],
    hasOnboardingStep: true,
    recommendedRoles: ['HR', 'Manager'],
    recommendedDashboards: ['HR'],
  },
  [AchareModuleKey.PAYROLL]: {
    key: AchareModuleKey.PAYROLL,
    label: 'Payroll',
    description: 'Manage salary, payroll and payslips.',
    icon: 'IconCash',
    position: 5,
    navigationFolderUniversalIdentifier: '20202020-d006-4d06-8d06-c0aba11c0006',
    features: [
      AchareFeatureKey.SALARY,
      AchareFeatureKey.PAYROLL,
      AchareFeatureKey.PAYSLIPS,
      AchareFeatureKey.PAYROLL_ADJUSTMENTS,
    ],
    hasOnboardingStep: true,
    recommendedRoles: ['HR', 'Finance'],
    recommendedDashboards: ['Payroll'],
  },
  [AchareModuleKey.FINANCE]: {
    key: AchareModuleKey.FINANCE,
    label: 'Finance',
    description: 'Manage invoices and payments.',
    icon: 'IconFileInvoice',
    position: 6,
    navigationFolderUniversalIdentifier: '20202020-d008-4d08-8d08-c0aba11c0008',
    features: [AchareFeatureKey.INVOICES, AchareFeatureKey.PAYMENTS],
    hasOnboardingStep: true,
    recommendedRoles: ['Finance'],
    recommendedDashboards: ['Finance'],
  },
  [AchareModuleKey.DOCUMENTS]: {
    key: AchareModuleKey.DOCUMENTS,
    label: 'Documents',
    description: 'Manage company and employee documents.',
    icon: 'IconFile',
    position: 7,
    navigationFolderUniversalIdentifier: '20202020-d007-4d07-8d07-c0aba11c0007',
    features: [AchareFeatureKey.DOCUMENTS],
    hasOnboardingStep: true,
  },
  [AchareModuleKey.COLLABORATION]: {
    key: AchareModuleKey.COLLABORATION,
    label: 'Collaboration',
    description: 'Manage internal work and communication.',
    icon: 'IconCheckbox',
    position: 8,
    // Tasks live under the "My Work" folder; there is no dedicated folder.
    features: [
      AchareFeatureKey.TASKS,
      AchareFeatureKey.NOTES,
      AchareFeatureKey.ANNOUNCEMENTS,
    ],
    hasOnboardingStep: false,
  },
  [AchareModuleKey.ANALYTICS]: {
    key: AchareModuleKey.ANALYTICS,
    label: 'Analytics',
    description: 'Dashboards and reporting across enabled modules.',
    icon: 'IconChartBar',
    position: 9,
    navigationFolderUniversalIdentifier: '20202020-d009-4d09-8d09-c0aba11c0009',
    features: [AchareFeatureKey.DASHBOARDS],
    hasOnboardingStep: true,
  },
};

/**
 * Modules in canonical display / onboarding order.
 */
export const ACHARE_MODULE_ORDER: AchareModuleKey[] = Object.values(
  ACHARE_MODULES,
)
  .sort((first, second) => first.position - second.position)
  .map((module) => module.key);
