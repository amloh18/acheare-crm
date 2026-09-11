/**
 * Achare product modules.
 *
 * A module is a top-level grouping of features that maps 1:1 to a navigation
 * folder in the Achare workspace (CRM, Recruitment, Team, HR, …). Modules are
 * never toggled directly — enabling at least one feature inside a module makes
 * the module visible.
 */
export enum AchareModuleKey {
  CRM = 'CRM',
  RECRUITMENT = 'RECRUITMENT',
  TEAM = 'TEAM',
  HR = 'HR',
  PAYROLL = 'PAYROLL',
  FINANCE = 'FINANCE',
  DOCUMENTS = 'DOCUMENTS',
  COLLABORATION = 'COLLABORATION',
  ANALYTICS = 'ANALYTICS',
}
