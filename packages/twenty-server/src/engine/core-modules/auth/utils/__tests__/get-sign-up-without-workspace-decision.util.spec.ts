import { getSignUpWithoutWorkspaceDecision } from 'src/engine/core-modules/auth/utils/get-sign-up-without-workspace-decision.util';

describe('getSignUpWithoutWorkspaceDecision', () => {
  it('should allow the first sign up of a fresh instance whatever the restrictions', () => {
    expect(
      getSignUpWithoutWorkspaceDecision({
        isMultiWorkspaceEnabled: false,
        isWorkspaceCreationLimitedToServerAdmins: true,
        workspaceCount: 0,
      }),
    ).toBe('allowed');
  });

  it('should allow a sign up when workspace creation is unrestricted', () => {
    expect(
      getSignUpWithoutWorkspaceDecision({
        isMultiWorkspaceEnabled: false,
        isWorkspaceCreationLimitedToServerAdmins: false,
        workspaceCount: 1,
      }),
    ).toBe('allowed');
  });

  it('should allow a sign up without a destination when workspace creation is unrestricted', () => {
    expect(
      getSignUpWithoutWorkspaceDecision({
        isMultiWorkspaceEnabled: true,
        isWorkspaceCreationLimitedToServerAdmins: false,
        workspaceCount: 1,
      }),
    ).toBe('allowed');
  });

  it('should require a destination when workspace creation is restricted to server admins', () => {
    expect(
      getSignUpWithoutWorkspaceDecision({
        isMultiWorkspaceEnabled: true,
        isWorkspaceCreationLimitedToServerAdmins: true,
        workspaceCount: 1,
      }),
    ).toBe('requiresDestination');
  });
});
