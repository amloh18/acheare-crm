import {
  TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
  getRoleUniversalIdentifier,
} from 'twenty-shared/application';

const getStandardRoleUniversalIdentifier = (label: string) =>
  getRoleUniversalIdentifier({
    applicationUniversalIdentifier:
      TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    label,
  });

export const STANDARD_ROLE = {
  admin: { universalIdentifier: '20202020-02c2-43f2-b94d-cab1f2b532eb' },
  // Achare domain roles. They are shipped with every workspace as an
  // assignable starting point; per-object and per-field permissions stay a
  // workspace-level configuration concern (Settings → Roles).
  recruiter: {
    universalIdentifier: getStandardRoleUniversalIdentifier('Recruiter'),
  },
  hrManager: {
    universalIdentifier: getStandardRoleUniversalIdentifier('HR Manager'),
  },
  finance: {
    universalIdentifier: getStandardRoleUniversalIdentifier('Finance'),
  },
} as const satisfies Record<string, { universalIdentifier: string }>;
