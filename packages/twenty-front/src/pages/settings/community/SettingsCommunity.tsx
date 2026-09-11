import { SettingsCard } from '@/settings/components/SettingsCard';
import { SettingsDiscoveryHeroCard } from '@/settings/components/SettingsDiscoveryHeroCard';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsLabContent } from '@/settings/lab/components/SettingsLabContent';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { useCallback, useContext } from 'react';
import {
  IconBrandX,
  IconBriefcase,
  IconTransform,
  type IconComponent,
  useIcons,
} from 'twenty-ui/icon';
import { H2Title } from 'twenty-ui/typography';
import { Section } from 'twenty-ui/layout';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import {
  MOBILE_VIEWPORT,
  ThemeContext,
  themeCssVariables,
} from 'twenty-ui/theme-constants';
import coverDark from '~/pages/settings/community/assets/cover-dark.png';
import coverLight from '~/pages/settings/community/assets/cover-light.png';

const SETTINGS_COMMUNITY_HERO_INSTANCE_ID_PREFIX = 'settings-community-hero';

const StyledCardLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  min-width: 0;
  padding: 0;
  text-decoration: none;
`;

const StyledCardAnchor = styled.a`
  display: block;
  min-width: 0;
  text-decoration: none;
`;

const StyledCardsGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[2]};
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: ${MOBILE_VIEWPORT}px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFeaturesContent = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[4]};
`;

export const SettingsCommunity = () => {
  const { theme } = useContext(ThemeContext);
  const { getIcon } = useIcons();
  const IconBrandDiscord = getIcon('IconBrandDiscord');
  const { enqueueInfoSnackBar } = useSnackBar();

  const showComingSoon = useCallback(() => {
    enqueueInfoSnackBar({ message: t`Coming soon` });
  }, [enqueueInfoSnackBar]);

  const socialLinks: {
    Icon: IconComponent;
    iconColor: string;
    cardTitle: string;
    onClick: () => void;
  }[] = [
    {
      Icon: IconBrandDiscord,
      iconColor: themeCssVariables.color.blue9,
      cardTitle: t`Join our Discord`,
      onClick: showComingSoon,
    },
    {
      Icon: IconBrandX,
      iconColor: themeCssVariables.font.color.primary,
      cardTitle: t`Follow us on X`,
      onClick: showComingSoon,
    },
  ];

  return (
    <SettingsPageLayout
      title={t`Community`}
      links={[
        {
          children: t`Other`,
          href: getSettingsPath(SettingsPath.Community),
        },
        { children: t`Community` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <SettingsDiscoveryHeroCard
            lightSrc={coverLight}
            darkSrc={coverDark}
            instanceIdPrefix={SETTINGS_COMMUNITY_HERO_INSTANCE_ID_PREFIX}
            tabs={[]}
          />
        </Section>

        <Section>
          <H2Title
            title={t`Join the community`}
            description={t`Stay up to date with product news and community updates.`}
          />
          <StyledCardsGrid>
            {socialLinks.map(({ onClick, Icon, iconColor, cardTitle }) => (
              <StyledCardLink
                key={cardTitle}
                onClick={onClick}
              >
                <SettingsCard
                  Icon={
                    <Icon
                      size={theme.icon.size.md}
                      stroke={theme.icon.stroke.sm}
                    />
                  }
                  iconColor={iconColor}
                  title={cardTitle}
                />
              </StyledCardLink>
            ))}
          </StyledCardsGrid>
        </Section>

        <Section>
          <H2Title
            title={t`Partners`}
            description={t`Hire a partner to help you implement and customize ACHEARE.`}
          />
          <StyledCardAnchor
            href="https://morigird.com/partners/list"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SettingsCard
              Icon={
                <IconBriefcase
                  size={theme.icon.size.md}
                  stroke={theme.icon.stroke.sm}
                />
              }
              title={t`Browse partners`}
            />
          </StyledCardAnchor>
        </Section>

        <Section>
          <H2Title
            title={t`Features`}
            description={t`Try our upcoming features. Note they are still in beta. Please bear with us and report any issues you find.`}
          />
          <StyledFeaturesContent>
            <SettingsLabContent />
            <StyledCardAnchor
              href="https://morigird.com/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SettingsCard
                Icon={
                  <IconTransform
                    size={theme.icon.size.md}
                    stroke={theme.icon.stroke.sm}
                  />
                }
                title={t`Read changelog`}
              />
            </StyledCardAnchor>
          </StyledFeaturesContent>
        </Section>
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
