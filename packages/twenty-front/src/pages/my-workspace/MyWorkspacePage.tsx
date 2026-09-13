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
import {
  IconLogin2,
  IconLogout,
  IconClock,
  IconCalendar,
  IconCurrencyDollar,
  IconInbox,
} from 'twenty-ui/icon';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { RecordIndexSkeletonLoader } from '@/object-record/record-index/components/RecordIndexSkeletonLoader';
import { AchareRoleSwitcherBar } from '@/achare/components/AchareRoleSwitcherBar';

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

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[2]} 0;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};

  &:last-of-type {
    border-bottom: none;
  }
`;

const StyledRowMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledRowTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledRowMeta = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 0.8rem;
`;

const StyledRowValue = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
`;

const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString() : '—';

const formatAmount = (
  amountMicros: number | null | undefined,
  currencyCode: string | null | undefined,
) => {
  if (amountMicros === null || amountMicros === undefined) {
    return '—';
  }

  return new Intl.NumberFormat(undefined, {
    style: currencyCode ? 'currency' : 'decimal',
    currency: currencyCode ?? undefined,
  }).format(amountMicros / 1_000_000);
};

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

  const pendingLeaveRequestList: {
    id: string;
    startDate: string | null;
    endDate: string | null;
    days: number | null;
    status: string | null;
  }[] = workspaceData?.pendingLeaveRequestList ?? [];

  const leaveBalanceList: {
    id: string;
    year: number | null;
    entitled: number;
    used: number;
    pending: number;
    available: number;
  }[] = workspaceData?.leaveBalanceList ?? [];

  const recentPayslipList: {
    id: string;
    netPayAmountMicros: number | null;
    currencyCode: string | null;
    paymentStatus: string | null;
    paidAt: string | null;
  }[] = workspaceData?.recentPayslipList ?? [];

  const announcementList: {
    id: string;
    title: string;
    body: string | null;
    publishAt: string | null;
  }[] = workspaceData?.announcementList ?? [];

  return (
    <PageContainer>
      <Section>
        <AchareRoleSwitcherBar />
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

      <Section>
        <H2Title title={t`My Leave`} />
        {pendingLeaveRequestList.length === 0 ? (
          <StyledCardSubtext>{t`No pending leave requests`}</StyledCardSubtext>
        ) : (
          <StyledList>
            {pendingLeaveRequestList.map((leaveRequest) => (
              <StyledRow key={leaveRequest.id}>
                <StyledRowMain>
                  <StyledRowTitle>
                    {formatDate(leaveRequest.startDate)} –{' '}
                    {formatDate(leaveRequest.endDate)}
                  </StyledRowTitle>
                  <StyledRowMeta>
                    {leaveRequest.days ?? 0} {t`days`}
                  </StyledRowMeta>
                </StyledRowMain>
                <StyledRowValue>{leaveRequest.status ?? '—'}</StyledRowValue>
              </StyledRow>
            ))}
          </StyledList>
        )}

        {leaveBalanceList.length > 0 && (
          <StyledList>
            {leaveBalanceList.map((balance) => (
              <StyledRow key={balance.id}>
                <StyledRowMain>
                  <StyledRowTitle>
                    {t`Leave balance`} {balance.year ?? ''}
                  </StyledRowTitle>
                  <StyledRowMeta>
                    {t`Entitled`} {balance.entitled} · {t`Used`} {balance.used}{' '}
                    · {t`Pending`} {balance.pending}
                  </StyledRowMeta>
                </StyledRowMain>
                <StyledRowValue>
                  {balance.available} {t`days`}
                </StyledRowValue>
              </StyledRow>
            ))}
          </StyledList>
        )}
      </Section>

      <Section>
        <H2Title title={t`My Payslips`} />
        {recentPayslipList.length === 0 ? (
          <StyledCardSubtext>{t`No payslips yet`}</StyledCardSubtext>
        ) : (
          <StyledList>
            {recentPayslipList.map((payslip) => (
              <StyledRow key={payslip.id}>
                <StyledRowMain>
                  <StyledRowTitle>
                    {formatAmount(
                      payslip.netPayAmountMicros,
                      payslip.currencyCode,
                    )}
                  </StyledRowTitle>
                  <StyledRowMeta>
                    {payslip.paidAt
                      ? t`Paid on ${formatDate(payslip.paidAt)}`
                      : t`Awaiting payment`}
                  </StyledRowMeta>
                </StyledRowMain>
                <StyledRowValue>{payslip.paymentStatus ?? '—'}</StyledRowValue>
              </StyledRow>
            ))}
          </StyledList>
        )}
      </Section>

      <Section>
        <H2Title title={t`Announcements`} />
        {announcementList.length === 0 ? (
          <StyledCardSubtext>{t`No announcements`}</StyledCardSubtext>
        ) : (
          <StyledList>
            {announcementList.map((announcement) => (
              <StyledRow key={announcement.id}>
                <StyledRowMain>
                  <StyledRowTitle>{announcement.title}</StyledRowTitle>
                  <StyledRowMeta>{announcement.body ?? ''}</StyledRowMeta>
                </StyledRowMain>
                <StyledRowValue>
                  {formatDate(announcement.publishAt)}
                </StyledRowValue>
              </StyledRow>
            ))}
          </StyledList>
        )}
      </Section>
    </PageContainer>
  );
};
