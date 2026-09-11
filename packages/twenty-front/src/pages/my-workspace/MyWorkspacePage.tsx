import { useLingui } from '@lingui/react/macro';
import { styled } from '@linaria/react';

import { useMyWorkspaceData } from '@/hr/hooks/useMyWorkspaceData';
import { useCheckInMutation } from '@/hr/hooks/useCheckInMutation';
import { useCheckOutMutation } from '@/hr/hooks/useCheckOutMutation';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { Section } from 'twenty-ui/layout';
import { H2Title } from 'twenty-ui/typography';
import { MainButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconLogin2, IconLogout, IconClock, IconCalendar, IconCurrencyDollar, IconInbox } from 'twenty-ui/icon';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { RecordIndexSkeletonLoader } from '@/object-record/record-index/components/RecordIndexSkeletonLoader';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  color: ${themeCssVariables.font.color.primary};
  font-weight: 500;
`;

const StyledCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledCardSubtext = styled.div`
  font-size: 0.875rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const MyWorkspacePage = () => {
  const { t } = useLingui();
  const { data, loading, refetch } = useMyWorkspaceData();
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const workspaceData = data?.myWorkspaceData;

  const handleCheckIn = async () => {
    try {
      await checkIn({ variables: { input: {} } });
      enqueueSuccessSnackBar({ message: t`Checked in successfully` });
      await refetch();
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : t`Check-in failed`,
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut({ variables: { input: {} } });
      enqueueSuccessSnackBar({ message: t`Checked out successfully` });
      await refetch();
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : t`Check-out failed`,
      });
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <RecordIndexSkeletonLoader />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section>
        <H2Title title={t`Today`} />
        <StyledGrid>
          <StyledCard>
            <StyledCardHeader>
              <IconClock size={20} />
              {t`Attendance`}
            </StyledCardHeader>
            <StyledCardValue>
              {workspaceData?.attendanceStatus
                ? t`${workspaceData.attendanceStatus}`
                : t`Not checked in`}
            </StyledCardValue>
            {workspaceData?.firstCheckIn && (
              <StyledCardSubtext>
                {t`Checked in at`}{' '}
                {new Date(workspaceData.firstCheckIn).toLocaleTimeString()}
              </StyledCardSubtext>
            )}
            <StyledButtonRow>
              <MainButton
                Icon={IconLogin2}
                title={t`Check In`}
                onClick={handleCheckIn}
                disabled={workspaceData?.attendanceStatus === 'PRESENT'}
              />
              <MainButton
                Icon={IconLogout}
                title={t`Check Out`}
                onClick={handleCheckOut}
                disabled={!workspaceData?.attendanceStatus}
              />
            </StyledButtonRow>
          </StyledCard>

          <StyledCard>
            <StyledCardHeader>
              <IconCalendar size={20} />
              {t`Leave Balance`}
            </StyledCardHeader>
            <StyledCardValue>
              {workspaceData?.leaveBalanceDays ?? 0} {t`days`}
            </StyledCardValue>
            <StyledCardSubtext>
              {workspaceData?.pendingLeaveRequests
                ? t`${workspaceData.pendingLeaveRequests} pending requests`
                : t`No pending requests`}
            </StyledCardSubtext>
          </StyledCard>

          <StyledCard>
            <StyledCardHeader>
              <IconCurrencyDollar size={20} />
              {t`Payslips`}
            </StyledCardHeader>
            <StyledCardValue>
              {workspaceData?.recentPayslipCount ?? 0}
            </StyledCardValue>
            <StyledCardSubtext>{t`Recent payslips`}</StyledCardSubtext>
          </StyledCard>

          <StyledCard>
            <StyledCardHeader>
              <IconInbox size={20} />
              {t`Tasks`}
            </StyledCardHeader>
            <StyledCardValue>
              {workspaceData?.stats?.pendingTasks ?? 0}
            </StyledCardValue>
            <StyledCardSubtext>{t`Pending tasks`}</StyledCardSubtext>
          </StyledCard>
        </StyledGrid>
      </Section>
    </PageContainer>
  );
};
