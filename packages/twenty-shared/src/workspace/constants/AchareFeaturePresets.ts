import { AchareFeatureKey } from '../types/AchareFeatureKey';

export type AchareFeaturePresetKey =
  | 'RECRUITMENT_AGENCY'
  | 'INTERNAL_COMPANY'
  | 'SALES_TEAM'
  | 'COMPLETE'
  | 'CUSTOM';

export type AchareFeaturePreset = {
  key: AchareFeaturePresetKey;
  label: string;
  description: string;
  /**
   * Features the preset pre-selects. Presets only pre-select — they never
   * hard-code the product around an industry, and the user can always change
   * the selection afterwards.
   */
  features: AchareFeatureKey[];
};

export const ACHARE_FEATURE_PRESETS: Record<
  AchareFeaturePresetKey,
  AchareFeaturePreset
> = {
  RECRUITMENT_AGENCY: {
    key: 'RECRUITMENT_AGENCY',
    label: 'Recruitment Agency',
    description: 'Hire for clients and manage your own team.',
    features: [
      AchareFeatureKey.COMPANIES,
      AchareFeatureKey.CONTACTS,
      AchareFeatureKey.OPPORTUNITIES,
      AchareFeatureKey.REQUIREMENTS,
      AchareFeatureKey.CANDIDATES,
      AchareFeatureKey.SUBMISSIONS,
      AchareFeatureKey.INTERVIEWS,
      AchareFeatureKey.EMPLOYEES,
      AchareFeatureKey.DEPARTMENTS,
      AchareFeatureKey.TEAMS,
      AchareFeatureKey.DESIGNATIONS,
      AchareFeatureKey.ONBOARDING,
      AchareFeatureKey.ATTENDANCE,
      AchareFeatureKey.LEAVE,
      AchareFeatureKey.ROSTERS,
      AchareFeatureKey.SHIFTS,
      AchareFeatureKey.SALARY,
      AchareFeatureKey.PAYROLL,
      AchareFeatureKey.PAYSLIPS,
      AchareFeatureKey.PAYROLL_ADJUSTMENTS,
      AchareFeatureKey.INVOICES,
      AchareFeatureKey.PAYMENTS,
      AchareFeatureKey.DOCUMENTS,
      AchareFeatureKey.TASKS,
      AchareFeatureKey.NOTES,
      AchareFeatureKey.ANNOUNCEMENTS,
      AchareFeatureKey.DASHBOARDS,
    ],
  },
  INTERNAL_COMPANY: {
    key: 'INTERNAL_COMPANY',
    label: 'Internal Company',
    description: 'Run your company — people, HR, payroll and customers.',
    features: [
      AchareFeatureKey.COMPANIES,
      AchareFeatureKey.CONTACTS,
      AchareFeatureKey.OPPORTUNITIES,
      AchareFeatureKey.EMPLOYEES,
      AchareFeatureKey.DEPARTMENTS,
      AchareFeatureKey.TEAMS,
      AchareFeatureKey.DESIGNATIONS,
      AchareFeatureKey.ONBOARDING,
      AchareFeatureKey.ATTENDANCE,
      AchareFeatureKey.LEAVE,
      AchareFeatureKey.SALARY,
      AchareFeatureKey.PAYROLL,
      AchareFeatureKey.PAYSLIPS,
      AchareFeatureKey.DOCUMENTS,
      AchareFeatureKey.TASKS,
      AchareFeatureKey.NOTES,
      AchareFeatureKey.ANNOUNCEMENTS,
      AchareFeatureKey.DASHBOARDS,
    ],
  },
  SALES_TEAM: {
    key: 'SALES_TEAM',
    label: 'Sales Team',
    description: 'Track customers, deals and internal work.',
    features: [
      AchareFeatureKey.COMPANIES,
      AchareFeatureKey.CONTACTS,
      AchareFeatureKey.OPPORTUNITIES,
      AchareFeatureKey.DOCUMENTS,
      AchareFeatureKey.TASKS,
      AchareFeatureKey.NOTES,
      AchareFeatureKey.DASHBOARDS,
    ],
  },
  COMPLETE: {
    key: 'COMPLETE',
    label: 'Complete Workspace',
    description: 'Every module — best for exploring the full product.',
    features: Object.values(AchareFeatureKey),
  },
  CUSTOM: {
    key: 'CUSTOM',
    label: 'Custom',
    description: 'Choose exactly what your company needs.',
    features: [],
  },
};
