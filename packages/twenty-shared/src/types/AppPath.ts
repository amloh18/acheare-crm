export enum AppPath {
  // Not logged-in
  Verify = '/verify',
  VerifyEmail = '/verify-email',
  SignInUp = '/welcome',
  Invite = '/invite/:workspaceInviteHash',
  ResetPassword = '/reset-password/:passwordResetToken',

  // Onboarding
  WorkspaceActivation = '/workspace-activation',
  CreateProfile = '/create/profile',
  SyncEmails = '/sync/emails',
  InstallApps = '/install-apps',
  InviteTeam = '/invite-team',
  PlanRequired = '/plan-required',
  PlanRequiredSuccess = '/plan-required/payment-success',
  BookCall = '/book-call',

  // Achare Onboarding
  AchareWelcome = '/acheare/welcome',
  AchareBasicSetup = '/acheare/basic-setup',
  AchareSetupChoice = '/acheare/setup-choice',
  AchareFeatureSelection = '/acheare/feature-selection',
  AchareAgency = '/acheare/agency',
  AchareTeam = '/acheare/team',
  AchareCrmImport = '/acheare/crm-import',
  AchareRecruitment = '/acheare/recruitment',
  AchareHr = '/acheare/hr',
  AcharePayroll = '/acheare/payroll',
  AchareFinance = '/acheare/finance',
  AchareDocuments = '/acheare/documents',
  AchareDashboard = '/acheare/dashboard',
  AchareReview = '/acheare/review',

  // Onboarded
  AiChat = '/chat/:threadId?',
  Index = '/',
  // Mobile only: the navigation menu is a page there rather than a drawer.
  Home = '/home',
  Dashboard = '/dashboard',
  TasksPage = '/objects/tasks',
  OpportunitiesPage = '/objects/opportunities',

  RecordIndexPage = '/objects/:objectNamePlural',
  RecordShowPage = '/object/:objectNameSingular/:objectRecordId',
  PageLayoutPage = '/page/:pageLayoutId',
  WorkflowCoreIndexPage = '/workflow-core',

  Settings = `settings`,
  SettingsCatchAll = `/${Settings}/*`,
  Developers = `developers`,
  DevelopersCatchAll = `/${Developers}/*`,

  Authorize = '/authorize',

  // Deep link for morigird.com/dpa → in-app DPA generator (login-gated redirect).
  Dpa = '/dpa',

  // 404 page not found
  NotFoundWildcard = '*',
  NotFound = '/not-found',
}
