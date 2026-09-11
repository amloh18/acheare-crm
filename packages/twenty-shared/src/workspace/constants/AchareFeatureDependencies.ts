import { AchareFeatureKey } from '../types/AchareFeatureKey';

/**
 * Achare feature dependency graph.
 *
 * `ACHARE_FEATURE_DEPENDENCIES[feature]` lists the features that must also be
 * enabled for `feature` to work. Dependencies are resolved transitively and
 * centrally (see `resolveAchareFeatureDependencies`) so that onboarding, the
 * Setup Center, navigation, dashboards and permissions all agree on the same
 * rules instead of each re-implementing them.
 *
 * Enabling a feature automatically enables its dependencies. Disabling a
 * feature does NOT disable its dependents here — that validation lives in the
 * service so the user can be told exactly what would break.
 */
export const ACHARE_FEATURE_DEPENDENCIES: Partial<
  Record<AchareFeatureKey, AchareFeatureKey[]>
> = {
  // Payroll chain: payroll needs people and a salary basis.
  [AchareFeatureKey.SALARY]: [AchareFeatureKey.EMPLOYEES],
  [AchareFeatureKey.PAYROLL]: [
    AchareFeatureKey.EMPLOYEES,
    AchareFeatureKey.SALARY,
  ],
  [AchareFeatureKey.PAYSLIPS]: [
    AchareFeatureKey.PAYROLL,
    AchareFeatureKey.EMPLOYEES,
  ],
  [AchareFeatureKey.PAYROLL_ADJUSTMENTS]: [AchareFeatureKey.PAYROLL],

  // HR chain: attendance, leave, rosters, shifts and onboarding all need people.
  [AchareFeatureKey.ONBOARDING]: [AchareFeatureKey.EMPLOYEES],
  [AchareFeatureKey.ATTENDANCE]: [AchareFeatureKey.EMPLOYEES],
  [AchareFeatureKey.LEAVE]: [AchareFeatureKey.EMPLOYEES],
  [AchareFeatureKey.ROSTERS]: [AchareFeatureKey.EMPLOYEES],
  [AchareFeatureKey.SHIFTS]: [AchareFeatureKey.EMPLOYEES],

  // Recruitment chain: submissions and interviews need candidates and requirements.
  [AchareFeatureKey.SUBMISSIONS]: [
    AchareFeatureKey.CANDIDATES,
    AchareFeatureKey.REQUIREMENTS,
  ],
  [AchareFeatureKey.INTERVIEWS]: [
    AchareFeatureKey.CANDIDATES,
    AchareFeatureKey.REQUIREMENTS,
  ],

  // Finance chain: payments settle invoices.
  [AchareFeatureKey.PAYMENTS]: [AchareFeatureKey.INVOICES],
};
