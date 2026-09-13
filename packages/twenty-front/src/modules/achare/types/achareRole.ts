export type AchareRole = 'admin' | 'recruiter' | 'bde' | 'hr' | 'employee';

export interface AchareRoleConfig {
  id: AchareRole;
  label: string;
  badge: string;
  description: string;
}

export const ACHARE_ROLES: AchareRoleConfig[] = [
  {
    id: 'admin',
    label: 'Executive / Founder',
    badge: 'Admin',
    description: 'Complete cross-functional visibility: revenue, recruitment, headcount & payroll.',
  },
  {
    id: 'recruiter',
    label: 'Talent Recruiter',
    badge: 'Recruiter',
    description: 'Pipeline-first workspace: jobs, applicant stages, sourcing & interview scheduling.',
  },
  {
    id: 'bde',
    label: 'BDE / Sales',
    badge: 'Sales',
    description: 'Revenue workspace: company accounts, deal pipeline, high-value opportunities.',
  },
  {
    id: 'hr',
    label: 'People & HR',
    badge: 'HR Ops',
    description: 'Operations hub: staff directory, attendance tracking, leave requests & payroll.',
  },
  {
    id: 'employee',
    label: 'Team Member',
    badge: 'Self-Service',
    description: 'Personal portal: daily punch in/out, tasks, leave balance & payslips.',
  },
];
