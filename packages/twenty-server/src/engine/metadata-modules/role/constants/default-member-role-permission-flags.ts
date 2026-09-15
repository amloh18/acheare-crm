import { PermissionFlagType } from 'twenty-shared/constants';

/**
 * Default permission flags for the Member role.
 * These restrictions are applied when a workspace is created.
 * Admins can modify these later through Settings > Members > Roles.
 *
 * RESTRICTED by default (security risk or admin-only):
 * - API_KEYS_AND_WEBHOOKS: No API access
 * - WORKSPACE: No workspace settings
 * - WORKSPACE_MEMBERS: No member management
 * - ROLES: No role management
 * - DATA_MODEL: No schema changes
 * - SECURITY: No security settings
 * - WORKFLOWS: No workflow automation
 * - IMPERSONATE: No impersonation
 * - SSO_BYPASS: No SSO bypass
 * - APPLICATIONS: No app management
 * - MARKETPLACE_APPS: No marketplace access
 * - LAYOUTS: No layout customization
 * - BILLING: No billing access
 * - AI_SETTINGS: No AI settings
 * - HTTP_REQUEST_TOOL: No HTTP requests
 * - CODE_INTERPRETER_TOOL: No code interpreter
 * - IMPORT_CSV: No CSV import
 * - EXPORT_CSV: No CSV export (data theft risk)
 * - CONNECTED_ACCOUNTS: No connected accounts
 *
 * ALLOWED by default (safe for members):
 * - VIEWS: Can create/manage views
 * - UPLOAD_FILE: Can upload files
 * - DOWNLOAD_FILE: Can download files
 * - SEND_EMAIL_TOOL: Can send emails
 * - CREATE_CALENDAR_EVENT_TOOL: Can create calendar events
 * - PROFILE_INFORMATION: Can edit own profile
 * - AI: Can use AI features
 */
export const DEFAULT_MEMBER_ROLE_RESTRICTED_FLAGS: PermissionFlagType[] = [
  // High security - admin only
  PermissionFlagType.API_KEYS_AND_WEBHOOKS,
  PermissionFlagType.WORKSPACE,
  PermissionFlagType.WORKSPACE_MEMBERS,
  PermissionFlagType.ROLES,
  PermissionFlagType.DATA_MODEL,
  PermissionFlagType.SECURITY,
  PermissionFlagType.IMPERSONATE,
  PermissionFlagType.SSO_BYPASS,
  PermissionFlagType.BILLING,

  // Feature management - admin only
  PermissionFlagType.APPLICATIONS,
  PermissionFlagType.MARKETPLACE_APPS,
  PermissionFlagType.LAYOUTS,
  PermissionFlagType.WORKFLOWS,
  PermissionFlagType.AI_SETTINGS,

  // Data safety - restricted by default
  PermissionFlagType.IMPORT_CSV,
  PermissionFlagType.EXPORT_CSV,
  PermissionFlagType.CONNECTED_ACCOUNTS,

  // Tool restrictions
  PermissionFlagType.HTTP_REQUEST_TOOL,
  PermissionFlagType.CODE_INTERPRETER_TOOL,
];

export const DEFAULT_MEMBER_ROLE_ALLOWED_FLAGS: PermissionFlagType[] = [
  // Safe for members
  PermissionFlagType.VIEWS,
  PermissionFlagType.UPLOAD_FILE,
  PermissionFlagType.DOWNLOAD_FILE,
  PermissionFlagType.SEND_EMAIL_TOOL,
  PermissionFlagType.CREATE_CALENDAR_EVENT_TOOL,
  PermissionFlagType.PROFILE_INFORMATION,
  PermissionFlagType.AI,
];
