import { useState, useEffect } from 'react';
import { useLingui } from '@lingui/react/macro';
import { styled } from '@linaria/react';

import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { SettingsTabBar } from '@/settings/components/layout/SettingsTabBar';
import { useSettingsActiveTabId } from '@/settings/components/layout/useSettingsActiveTabId';
import { SettingsWorkspaceDomainCard } from '@/settings/domains/components/SettingsWorkspaceDomainCard';
import { SettingsLogs } from '@/settings/event-logs/components/SettingsLogs';
import { DeleteWorkspace } from '@/settings/profile/components/DeleteWorkspace';
import { useHasPermissionFlag } from '@/settings/roles/hooks/useHasPermissionFlag';
import { SettingsSecuritySettings } from '@/settings/security/components/SettingsSecuritySettings';
import { NameField } from '@/settings/workspace/components/NameField';
import { WorkspaceLogoUploader } from '@/settings/workspace/components/WorkspaceLogoUploader';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useCompanySettings } from '@/hr/hooks/useCompanySettings';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { IconHistory, IconKey, IconSettings } from 'twenty-ui/icon';
import { H2Title } from 'twenty-ui/typography';
import { Section } from 'twenty-ui/layout';
import { Button } from 'twenty-ui/input';
import { PermissionFlagType } from '~/generated-metadata/graphql';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const SETTINGS_GENERAL_TABS_INSTANCE_ID = 'settings-general-tabs';

const GENERAL_TAB_GENERAL = 'general';
const GENERAL_TAB_SECURITY = 'security';
const GENERAL_TAB_LOGS = 'logs';

const StyledFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${themeCssVariables.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  font-size: 0.875rem;
  color: ${themeCssVariables.font.color.primary};
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;

const StyledToggle = styled.button<{ active: boolean }>`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  border-radius: ${themeCssVariables.border.radius.sm};
  border: 1px solid
    ${({ active }) =>
      active ? themeCssVariables.color.blue : themeCssVariables.border.color.medium};
  background: ${({ active }) =>
    active ? themeCssVariables.color.blue + '20' : themeCssVariables.background.primary};
  color: ${({ active }) =>
    active ? themeCssVariables.color.blue : themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
`;

const StyledToggleRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const WORKING_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const DAY_LABELS: Record<string, string> = {
  MON: 'Mon',
  TUE: 'Tue',
  WED: 'Wed',
  THU: 'Thu',
  FRI: 'Fri',
  SAT: 'Sat',
  SUN: 'Sun',
};

export const SettingsGeneral = () => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { settings, upsertCompanySettings, upsertLoading } = useCompanySettings();

  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );

  const hasSecurityPermission = useHasPermissionFlag(
    PermissionFlagType.SECURITY,
  );

  const [scheduleForm, setScheduleForm] = useState({
    timingMode: 'FIXED',
    workStartTime: '09:00',
    workEndTime: '18:00',
    flexibleHoursRequired: 8,
    breakMinutes: 60,
    graceMinutes: 15,
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    lateThresholdMinutes: 15,
    requireGeolocationForCheckIn: true,
    allowRemoteCheckIn: true,
  });

  useEffect(() => {
    if (settings) {
      setScheduleForm({
        timingMode: settings.timingMode || 'FIXED',
        workStartTime: settings.workStartTime || '09:00',
        workEndTime: settings.workEndTime || '18:00',
        flexibleHoursRequired: settings.flexibleHoursRequired || 8,
        breakMinutes: settings.breakMinutes || 60,
        graceMinutes: settings.graceMinutes || 15,
        workingDays: settings.workingDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        lateThresholdMinutes: settings.lateThresholdMinutes || 15,
        requireGeolocationForCheckIn: settings.requireGeolocationForCheckIn ?? true,
        allowRemoteCheckIn: settings.allowRemoteCheckIn ?? true,
      });
    }
  }, [settings]);

  const handleSaveSchedule = async () => {
    try {
      await upsertCompanySettings({ variables: { input: scheduleForm } });
      enqueueSuccessSnackBar({ message: t`Schedule settings saved` });
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : t`Failed to save`,
      });
    }
  };

  const toggleWorkingDay = (day: string) => {
    setScheduleForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const tabs = [
    { id: GENERAL_TAB_GENERAL, title: t`General`, Icon: IconSettings },
    ...(hasSecurityPermission
      ? [
          { id: GENERAL_TAB_SECURITY, title: t`Security`, Icon: IconKey },
          { id: GENERAL_TAB_LOGS, title: t`Logs`, Icon: IconHistory },
        ]
      : []),
  ];

  const activeTabId = useSettingsActiveTabId(
    SETTINGS_GENERAL_TABS_INSTANCE_ID,
    tabs.map((tab) => tab.id),
  );

  const renderActiveTabContent = () => {
    if (activeTabId === GENERAL_TAB_SECURITY) {
      return <SettingsSecuritySettings />;
    }

    return (
      <>
        <Section>
          <H2Title title={t`Picture`} />
          <WorkspaceLogoUploader />
        </Section>
        <Section>
          <H2Title title={t`Name`} description={t`Name of your workspace`} />
          <NameField />
        </Section>
        {isMultiWorkspaceEnabled && (
          <Section>
            <H2Title
              title={t`Workspace domain`}
              description={t`Edit your subdomain name or set a custom domain.`}
            />
            <SettingsWorkspaceDomainCard />
          </Section>
        )}

        <Section>
          <H2Title
            title={t`Work Schedule`}
            description={t`Configure work hours, timing mode, and attendance rules.`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <StyledField>
              <StyledLabel>{t`Timing Mode`}</StyledLabel>
              <StyledToggleRow>
                <StyledToggle
                  active={scheduleForm.timingMode === 'FIXED'}
                  onClick={() =>
                    setScheduleForm((prev) => ({ ...prev, timingMode: 'FIXED' }))
                  }
                >
                  {t`Fixed Hours`}
                </StyledToggle>
                <StyledToggle
                  active={scheduleForm.timingMode === 'FLEXIBLE'}
                  onClick={() =>
                    setScheduleForm((prev) => ({ ...prev, timingMode: 'FLEXIBLE' }))
                  }
                >
                  {t`Flexible (8h anytime)`}
                </StyledToggle>
              </StyledToggleRow>
            </StyledField>

            {scheduleForm.timingMode === 'FIXED' ? (
              <StyledFieldRow>
                <StyledField>
                  <StyledLabel>{t`Start Time`}</StyledLabel>
                  <StyledInput
                    type="time"
                    value={scheduleForm.workStartTime}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        workStartTime: e.target.value,
                      }))
                    }
                  />
                </StyledField>
                <StyledField>
                  <StyledLabel>{t`End Time`}</StyledLabel>
                  <StyledInput
                    type="time"
                    value={scheduleForm.workEndTime}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        workEndTime: e.target.value,
                      }))
                    }
                  />
                </StyledField>
              </StyledFieldRow>
            ) : (
              <StyledField>
                <StyledLabel>{t`Required Hours Per Day`}</StyledLabel>
                <StyledInput
                  type="number"
                  value={scheduleForm.flexibleHoursRequired}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      flexibleHoursRequired: parseInt(e.target.value) || 8,
                    }))
                  }
                  min={1}
                  max={12}
                />
              </StyledField>
            )}

            <StyledFieldRow>
              <StyledField>
                <StyledLabel>{t`Break (min)`}</StyledLabel>
                <StyledInput
                  type="number"
                  value={scheduleForm.breakMinutes}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      breakMinutes: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={0}
                />
              </StyledField>
              <StyledField>
                <StyledLabel>{t`Grace Period (min)`}</StyledLabel>
                <StyledInput
                  type="number"
                  value={scheduleForm.graceMinutes}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      graceMinutes: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={0}
                />
              </StyledField>
            </StyledFieldRow>

            {scheduleForm.timingMode === 'FIXED' && (
              <StyledField>
                <StyledLabel>{t`Late Threshold (min after start)`}</StyledLabel>
                <StyledInput
                  type="number"
                  value={scheduleForm.lateThresholdMinutes}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      lateThresholdMinutes: parseInt(e.target.value) || 0,
                    }))
                  }
                  min={0}
                />
              </StyledField>
            )}

            <StyledField>
              <StyledLabel>{t`Working Days`}</StyledLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {WORKING_DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleWorkingDay(day)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${
                        scheduleForm.workingDays.includes(day)
                          ? themeCssVariables.color.blue
                          : themeCssVariables.border.color.medium
                      }`,
                      background: scheduleForm.workingDays.includes(day)
                        ? themeCssVariables.color.blue + '20'
                        : themeCssVariables.background.primary,
                      color: scheduleForm.workingDays.includes(day)
                        ? themeCssVariables.color.blue
                        : themeCssVariables.font.color.secondary,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {DAY_LABELS[day]}
                  </button>
                ))}
              </div>
            </StyledField>
          </div>
        </Section>

        <Section>
          <H2Title
            title={t`Geofencing & Location`}
            description={t`Configure location requirements for clock-in.`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <StyledField>
              <StyledLabel>{t`Require location for clock-in`}</StyledLabel>
              <StyledToggleRow>
                <StyledToggle
                  active={scheduleForm.requireGeolocationForCheckIn}
                  onClick={() =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      requireGeolocationForCheckIn: !prev.requireGeolocationForCheckIn,
                    }))
                  }
                >
                  {scheduleForm.requireGeolocationForCheckIn ? t`Enabled` : t`Disabled`}
                </StyledToggle>
              </StyledToggleRow>
            </StyledField>

            <StyledField>
              <StyledLabel>{t`Allow remote clock-in (requires admin approval)`}</StyledLabel>
              <StyledToggleRow>
                <StyledToggle
                  active={scheduleForm.allowRemoteCheckIn}
                  onClick={() =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      allowRemoteCheckIn: !prev.allowRemoteCheckIn,
                    }))
                  }
                >
                  {scheduleForm.allowRemoteCheckIn ? t`Enabled` : t`Disabled`}
                </StyledToggle>
              </StyledToggleRow>
            </StyledField>
          </div>
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            title={t`Save Schedule`}
            onClick={handleSaveSchedule}
            disabled={upsertLoading}
          />
        </div>

        <Section>
          <DeleteWorkspace />
        </Section>
      </>
    );
  };

  return (
    <SettingsPageLayout
      title={t`General`}
      secondaryBar={
        hasSecurityPermission ? (
          <SettingsTabBar
            tabs={tabs}
            componentInstanceId={SETTINGS_GENERAL_TABS_INSTANCE_ID}
          />
        ) : undefined
      }
      links={[{ children: t`Workspace` }, { children: t`General` }]}
    >
      {activeTabId === GENERAL_TAB_LOGS ? (
        <SettingsLogs />
      ) : (
        <SettingsPageContainer>
          {renderActiveTabContent()}
        </SettingsPageContainer>
      )}
    </SettingsPageLayout>
  );
};
