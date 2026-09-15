import { styled } from '@linaria/react';

import { useIsSettingsDrawer } from '@/navigation/hooks/useIsSettingsDrawer';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Avatar } from 'twenty-ui/data-display';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { SettingsPath } from 'twenty-shared/types';

import { MainNavigationDrawerContent } from '@/navigation/components/MainNavigationDrawerContent';
import { MainNavigationDrawerModeSwitcher } from '@/navigation/components/MainNavigationDrawerModeSwitcher';
import { SettingsNavigationDrawerContent } from '@/navigation/components/SettingsNavigationDrawerContent';
import { NavigationDrawer } from '@/ui/navigation/navigation-drawer/components/NavigationDrawer';
import { NavigationDrawerFixedContent } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerFixedContent';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';

export type AppNavigationDrawerProps = {
  className?: string;
};

const StyledBottomSection = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  padding: ${themeCssVariables.spacing[1]} 0 0 0;
  border-top: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledUserProfile = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  width: 100%;
  text-align: left;
  border-radius: ${themeCssVariables.border.radius.sm};
  transition: background-color 0.15s ease;
  margin-bottom: ${themeCssVariables.spacing[1]};

  &:hover {
    background-color: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledUserName = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledUserEmail = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

export const AppNavigationDrawer = ({
  className,
}: AppNavigationDrawerProps) => {
  const isMobile = useIsMobile();
  const isSettingsDrawer = useIsSettingsDrawer();
  const navigateSettings = useNavigateSettings();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  // The main navigation is the home page on mobile, not a drawer.
  if (isMobile && !isSettingsDrawer) {
    return null;
  }

  const handleProfileClick = () => {
    navigateSettings(SettingsPath.ProfilePage);
  };

  const fullName = currentWorkspaceMember?.name
    ? `${currentWorkspaceMember.name.firstName} ${currentWorkspaceMember.name.lastName}`.trim()
    : '';
  const email = currentWorkspaceMember?.userEmail ?? '';

  return (
    <NavigationDrawer className={className}>
      {/* Mobile switches modes from the navigation bar at the bottom of the
          screen, so a second switcher inside the drawer only repeats it. */}
      {!isMobile && (
        <NavigationDrawerFixedContent>
          <MainNavigationDrawerModeSwitcher />
        </NavigationDrawerFixedContent>
      )}

      {isSettingsDrawer ? (
        <SettingsNavigationDrawerContent />
      ) : (
        <MainNavigationDrawerContent />
      )}

      {/* Bottom user profile section - only show on main navigation, not settings */}
      {!isMobile && !isSettingsDrawer && currentWorkspaceMember && (
        <StyledBottomSection>
          <StyledUserProfile onClick={handleProfileClick}>
            <Avatar
              avatarUrl={currentWorkspaceMember.avatarUrl}
              size="md"
              placeholder={fullName || email}
              placeholderColorSeed={currentWorkspaceMember.id}
              type="rounded"
            />
            <StyledUserInfo>
              {fullName && <StyledUserName>{fullName}</StyledUserName>}
              {email && <StyledUserEmail>{email}</StyledUserEmail>}
            </StyledUserInfo>
          </StyledUserProfile>
        </StyledBottomSection>
      )}
    </NavigationDrawer>
  );
};
