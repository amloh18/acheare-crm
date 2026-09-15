import { styled } from '@linaria/react';
import { useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useLingui } from '@lingui/react/macro';
import { IconLoader, IconAlertTriangle, IconDatabase } from 'twenty-ui/icon';

import { useAchareRole } from '@/achare/hooks/useAchareRole';
import { useMyWorkspaceData } from '@/hr/hooks/useMyWorkspaceData';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useCheckInMutation } from '@/hr/hooks/useCheckInMutation';
import { useCheckOutMutation } from '@/hr/hooks/useCheckOutMutation';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { Avatar } from 'twenty-ui/data-display';
import {
  IconClock,
  IconLogin2,
  IconLogout,
  IconCalendarEvent,
  IconPlayerPlay,
  IconCheckbox,
  IconTrendingUp,
  IconFileText,
  IconChevronRight,
  IconCircleDot,
  IconListCheck,
  IconCurrencyDollar,
  IconUser,
  IconCalendar,
  IconFile,
} from 'twenty-ui/icon';
import { useNavigate } from 'react-router-dom';

const StyledStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
  min-height: 200px;
`;

const StyledStateIcon = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledStateTitle = styled.h3`
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
  margin: 0 0 ${themeCssVariables.spacing[1]} 0;
`;

const StyledStateDescription = styled.p`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
  margin: 0;
  max-width: 320px;
`;

const StyledEmptyTabContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
  min-height: 180px;
`;

const StyledEmptyTabIcon = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  margin-bottom: ${themeCssVariables.spacing[3]};
  opacity: 0.5;
`;

const StyledEmptyTabTitle = styled.h4`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
  margin: 0 0 ${themeCssVariables.spacing[1]} 0;
`;

const StyledEmptyTabDescription = styled.p`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
  margin: 0;
  max-width: 280px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[5]};
  padding: ${themeCssVariables.spacing[6]};
  max-width: 1400px;
`;

const StyledGreeting = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledGreetingSub = styled.p`
  font-size: 0.875rem;
  color: ${themeCssVariables.font.color.secondary};
  margin: ${themeCssVariables.spacing[1]} 0 0 0;
`;

const StyledTopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${themeCssVariables.spacing[5]};
  align-items: start;
`;

const StyledEmployeeCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledEmployeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledDetailValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledDetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledStatusBadge = styled.span<{ status: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'ACTIVE'
      ? '#10b98120'
      : status === 'ON_LEAVE'
        ? '#f59e0b20'
        : '#ef444420'};
  color: ${({ status }) =>
    status === 'ACTIVE'
      ? '#10b981'
      : status === 'ON_LEAVE'
        ? '#f59e0b'
        : '#ef4444'};
`;

const StyledClockCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  min-width: 320px;
`;

const StyledClockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledClockTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledClockStatus = styled.span<{ isWorking: boolean }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ isWorking }) => (isWorking ? '#10b98120' : '#6b728020')};
  color: ${({ isWorking }) => (isWorking ? '#10b981' : '#6b7280')};
`;

const StyledTimer = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
`;

const StyledTimerSince = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledClockActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  width: 100%;
`;

const StyledClockButton = styled.button<{
  variant: 'break' | 'clockout';
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${({ variant }) =>
      variant === 'break'
        ? themeCssVariables.border.color.medium
        : '#ef4444'};
  background: ${({ variant }) =>
    variant === 'break'
      ? themeCssVariables.background.primary
      : '#ef4444'};
  color: ${({ variant }) =>
    variant === 'break'
      ? themeCssVariables.font.color.primary
      : '#ffffff'};
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const StyledKPIRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledKPICard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }
`;

const StyledKPIHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledKPITitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StyledKPIIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledKPIValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  line-height: 1.2;
`;

const StyledKPISubtext = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledKPIChevron = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledTabsRow = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTab = styled.button<{ isActive: boolean }>`
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  border-bottom: 2px solid
    ${({ isActive }) =>
      isActive ? themeCssVariables.font.color.primary : 'transparent'};
  transition: color 0.15s ease;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTabContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${themeCssVariables.spacing[5]};
`;

const StyledTabPanel = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledTabPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledTabPanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledViewAll = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.secondary};
  font-size: 0.8125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  text-align: left;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTd = styled.td`
  padding: ${themeCssVariables.spacing[3]};
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTaskCheckbox = styled.button`
  background: none;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: 4px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledPriorityDot = styled.span<{ priority: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  background: ${({ priority }) =>
    priority === 'HIGH'
      ? '#ef4444'
      : priority === 'MEDIUM'
        ? '#f59e0b'
        : '#10b981'};
`;

const StyledStatusBadgeSmall = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'IN_PROGRESS'
      ? '#3b82f620'
      : status === 'DONE'
        ? '#10b98120'
        : '#6b728020'};
  color: ${({ status }) =>
    status === 'IN_PROGRESS'
      ? '#3b82f6'
      : status === 'DONE'
        ? '#10b981'
        : '#6b7280'};
`;

const StyledSideCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSideCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledSideCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledScheduleItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const StyledScheduleDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-top: 6px;
  flex-shrink: 0;
`;

const StyledScheduleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledScheduleTitle = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledScheduleTime = styled.span`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledAnnouncementItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

type TabKey = 'tasks' | 'attendance' | 'leave' | 'payroll' | 'performance' | 'documents';

type TaskRecord = {
  __typename: 'Task';
  id: string;
  title: string;
  status: string | null;
  dueAt: string | null;
};

export const EmployeeDashboard = () => {
  const { t } = useLingui();
  const { role } = useAchareRole();
  const navigate = useNavigate();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const [activeTab, setActiveTab] = useState<TabKey>('tasks');
  const [isOnBreak, setIsOnBreak] = useState(false);

  const { data: myWorkspaceData, loading: myDataLoading, error: myDataError } = useMyWorkspaceData();
  const myData = myWorkspaceData?.myWorkspaceData;

  const { records: tasks, loading: tasksLoading, error: tasksError } = useFindManyRecords<TaskRecord>({
    objectNameSingular: CoreObjectNameSingular.Task,
    recordGqlFields: { id: true, title: true, status: true, dueAt: true },
    limit: 10,
  });

  const { updateOneRecord } = useUpdateOneRecord();
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();

  if (myDataLoading || tasksLoading) {
    return (
      <PageContainer>
        <StyledStateContainer>
          <StyledStateIcon>
            <IconLoader size={40} />
          </StyledStateIcon>
          <StyledStateTitle>{t`Loading your dashboard...`}</StyledStateTitle>
          <StyledStateDescription>
            {t`Fetching your workspace data.`}
          </StyledStateDescription>
        </StyledStateContainer>
      </PageContainer>
    );
  }

  if (myDataError || tasksError) {
    return (
      <PageContainer>
        <StyledStateContainer>
          <StyledStateIcon>
            <IconAlertTriangle size={40} />
          </StyledStateIcon>
          <StyledStateTitle>{t`Unable to load dashboard`}</StyledStateTitle>
          <StyledStateDescription>
            {t`There was an error loading your workspace data. Please try again.`}
          </StyledStateDescription>
        </StyledStateContainer>
      </PageContainer>
    );
  }

  const firstName = currentWorkspaceMember?.name?.firstName ?? 'Employee';
  const employeeCode = (currentWorkspaceMember as any)?.employeeCode ?? 'EMP-001';
  const jobTitle = currentWorkspaceMember?.jobTitle ?? 'Team Member';
  const employmentType = (currentWorkspaceMember as any)?.employmentType ?? 'Full-time';
  const workLocation = (currentWorkspaceMember as any)?.workLocation ?? 'Office';
  const employeeStatus = (currentWorkspaceMember as any)?.status ?? 'ACTIVE';
  const avatarUrl = currentWorkspaceMember?.avatarUrl;

  const attendanceStatus = myData?.attendanceStatus ?? 'NOT_CHECKED_IN';
  const firstCheckIn = myData?.firstCheckIn;
  const workedMinutes = myData?.workedMinutes ?? 0;
  const leaveBalance = myData?.leaveBalanceDays ?? 0;
  const pendingTasks = myData?.stats?.pendingTasks ?? 0;

  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  const formatElapsed = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  };

  const displayTime = attendanceStatus === 'CHECKED_IN'
    ? formatElapsed(workedMinutes)
    : elapsedTime;

  const handleCheckIn = async () => {
    try {
      await checkIn({ variables: { input: {} } });
      enqueueSuccessSnackBar({ message: 'Clocked in successfully' });
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : 'Check-in failed',
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut({ variables: { input: {} } });
      enqueueSuccessSnackBar({ message: 'Clocked out successfully' });
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : 'Check-out failed',
      });
    }
  };

  const handleToggleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  const handleToggleTask = async (taskId: string, currentStatus: string | null) => {
    try {
      await updateOneRecord({
        objectNameSingular: CoreObjectNameSingular.Task,
        idToUpdate: taskId,
        updateOneRecordInput: {
          status: currentStatus === 'DONE' ? 'TODO' : 'DONE',
        },
      });
    } catch {
      // error handled by hook
    }
  };

  const formatCurrency = (amountMicros?: number) => {
    if (!amountMicros) return '$0.00';
    const amount = amountMicros / 1_000_000;
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t`Good morning`;
    if (hour < 17) return t`Good afternoon`;
    return t`Good evening`;
  };

  const tabs: { key: TabKey; label: string; icon: typeof IconListCheck }[] = [
    { key: 'tasks', label: t`My Tasks`, icon: IconListCheck },
    { key: 'attendance', label: t`Attendance`, icon: IconCalendarEvent },
    { key: 'leave', label: t`Leave`, icon: IconPlayerPlay },
    { key: 'payroll', label: t`Payroll`, icon: IconCurrencyDollar },
    { key: 'performance', label: t`Performance`, icon: IconTrendingUp },
    { key: 'documents', label: t`Documents`, icon: IconFile },
  ];

  return (
    <PageContainer>
      <StyledContainer>
        <div>
          <StyledGreeting>
            {getGreeting()}, {firstName}!
          </StyledGreeting>
          <StyledGreetingSub>
            {t`Here's your work overview for today.`}
          </StyledGreetingSub>
        </div>

        <StyledTopRow>
          <StyledEmployeeCard>
            <Avatar
              avatarUrl={avatarUrl}
              size="lg"
              placeholder={firstName}
              placeholderColorSeed={currentWorkspaceMember?.id}
              type="rounded"
            />
            <StyledEmployeeInfo>
              <StyledEmployeeInfo>
                <StyledDetailItem>
                  <StyledDetailValue>{firstName}</StyledDetailValue>
                  <StyledDetailLabel>{employeeCode}</StyledDetailLabel>
                </StyledDetailItem>
                <StyledDetailItem>
                  <StyledDetailValue>{jobTitle}</StyledDetailValue>
                  <StyledDetailLabel>{t`Job Title`}</StyledDetailLabel>
                </StyledDetailItem>
                <StyledDetailItem>
                  <StyledDetailValue>{employmentType}</StyledDetailValue>
                  <StyledDetailLabel>{t`Employment Type`}</StyledDetailLabel>
                </StyledDetailItem>
                <StyledDetailItem>
                  <StyledDetailValue>{workLocation}</StyledDetailValue>
                  <StyledDetailLabel>{t`Work Location`}</StyledDetailLabel>
                </StyledDetailItem>
              </StyledEmployeeInfo>
              <StyledStatusBadge status={employeeStatus}>
                {employeeStatus}
              </StyledStatusBadge>
            </StyledEmployeeInfo>
          </StyledEmployeeCard>

          <StyledClockCard>
            <StyledClockHeader>
              <StyledClockTitle>
                <IconClock size={18} />
                <span>{t`Clock In & Out`}</span>
              </StyledClockTitle>
              <StyledClockStatus isWorking={attendanceStatus === 'CHECKED_IN'}>
                {attendanceStatus === 'CHECKED_IN' ? t`Currently Working` : t`Not Clocked In`}
              </StyledClockStatus>
            </StyledClockHeader>
            <StyledTimer>{displayTime}</StyledTimer>
            {firstCheckIn && (
              <StyledTimerSince>
                {t`Since`} {formatTime(firstCheckIn)}
              </StyledTimerSince>
            )}
            <StyledClockActions>
              <StyledClockButton
                variant="break"
                onClick={handleToggleBreak}
                disabled={attendanceStatus !== 'CHECKED_IN'}
              >
                {isOnBreak ? t`End Break` : t`Take Break`}
              </StyledClockButton>
              <StyledClockButton
                variant="clockout"
                onClick={attendanceStatus === 'CHECKED_IN' ? handleCheckOut : handleCheckIn}
              >
                {attendanceStatus === 'CHECKED_IN' ? (
                  <><IconLogout size={16} /> {t`Clock Out`}</>
                ) : (
                  <><IconLogin2 size={16} /> {t`Clock In`}</>
                )}
              </StyledClockButton>
            </StyledClockActions>
          </StyledClockCard>
        </StyledTopRow>

        <StyledKPIRow>
          <StyledKPICard onClick={() => navigate('/attendance-leave')}>
            <StyledKPIHeader>
              <StyledKPITitle>{t`Attendance Today`}</StyledKPITitle>
              <StyledKPIIcon>
                <IconCalendarEvent size={18} />
              </StyledKPIIcon>
            </StyledKPIHeader>
            <StyledKPIValue>
              {attendanceStatus === 'CHECKED_IN' ? t`Present` : t`Not Checked In`}
            </StyledKPIValue>
            <StyledKPISubtext>
              {firstCheckIn
                ? `${t`Checked in at`} ${formatTime(firstCheckIn)}`
                : t`Ready for duty`}
            </StyledKPISubtext>
            <StyledKPIChevron>
              <IconChevronRight size={16} />
            </StyledKPIChevron>
          </StyledKPICard>

              <StyledKPICard onClick={() => navigate('/attendance-leave')}>
            <StyledKPIHeader>
              <StyledKPITitle>{t`Leave Balance`}</StyledKPITitle>
              <StyledKPIIcon>
                <IconPlayerPlay size={18} />
              </StyledKPIIcon>
            </StyledKPIHeader>
            <StyledKPIValue>{leaveBalance} days</StyledKPIValue>
            <StyledKPISubtext>{t`Available this year`}</StyledKPISubtext>
            <StyledKPIChevron>
              <IconChevronRight size={16} />
            </StyledKPIChevron>
          </StyledKPICard>

          <StyledKPICard onClick={() => setActiveTab('tasks')}>
            <StyledKPIHeader>
              <StyledKPITitle>{t`My Tasks`}</StyledKPITitle>
              <StyledKPIIcon>
                <IconCheckbox size={18} />
              </StyledKPIIcon>
            </StyledKPIHeader>
            <StyledKPIValue>{pendingTasks}</StyledKPIValue>
            <StyledKPISubtext>{t`Pending tasks`}</StyledKPISubtext>
            <StyledKPIChevron>
              <IconChevronRight size={16} />
            </StyledKPIChevron>
          </StyledKPICard>

          <StyledKPICard>
            <StyledKPIHeader>
              <StyledKPITitle>{t`Performance`}</StyledKPITitle>
              <StyledKPIIcon>
                <IconTrendingUp size={18} />
              </StyledKPIIcon>
            </StyledKPIHeader>
            <StyledKPIValue>--</StyledKPIValue>
            <StyledKPISubtext>{t`Current quarter`}</StyledKPISubtext>
            <StyledKPIChevron>
              <IconChevronRight size={16} />
            </StyledKPIChevron>
          </StyledKPICard>
        </StyledKPIRow>

        <div>
          <StyledTabsRow>
            {tabs.map((tab) => (
              <StyledTab
                key={tab.key}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </StyledTab>
            ))}
          </StyledTabsRow>
        </div>

        <StyledTabContent>
          {activeTab === 'tasks' && (
            <>
              <StyledTabPanel>
                <StyledTabPanelHeader>
                  <StyledTabPanelTitle>
                    <IconListCheck size={18} />
                    <span>{t`My Tasks`}</span>
                  </StyledTabPanelTitle>
                  <StyledViewAll onClick={() => navigate('/objects/tasks')}>
                    {t`View All`} <IconChevronRight size={14} />
                  </StyledViewAll>
                </StyledTabPanelHeader>
                <StyledTaskTable>
                  <thead>
                    <tr>
                      <StyledTh></StyledTh>
                      <StyledTh>{t`Task`}</StyledTh>
                      <StyledTh>{t`Priority`}</StyledTh>
                      <StyledTh>{t`Due Date`}</StyledTh>
                      <StyledTh>{t`Status`}</StyledTh>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 6).map((task) => (
                      <tr key={task.id}>
                        <StyledTd>
                          <StyledTaskCheckbox
                            onClick={() => handleToggleTask(task.id, task.status)}
                          >
                            {task.status === 'DONE' && (
                              <IconCircleDot size={14} color="#10b981" />
                            )}
                          </StyledTaskCheckbox>
                        </StyledTd>
                        <StyledTd>{task.title}</StyledTd>
                        <StyledTd>
                          <StyledPriorityDot priority="MEDIUM" />
                          {t`Medium`}
                        </StyledTd>
                        <StyledTd>
                          {task.dueAt
                            ? new Date(task.dueAt).toLocaleDateString()
                            : '--'}
                        </StyledTd>
                        <StyledTd>
                          <StyledStatusBadgeSmall status={task.status ?? 'TODO'}>
                            {task.status === 'IN_PROGRESS'
                              ? t`In Progress`
                              : task.status === 'DONE'
                                ? t`Done`
                                : t`To Do`}
                          </StyledStatusBadgeSmall>
                        </StyledTd>
                      </tr>
                    ))}
                    {tasks.length === 0 && !tasksLoading && (
                      <tr>
                        <StyledTd colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                          {t`No tasks assigned yet`}
                        </StyledTd>
                      </tr>
                    )}
                  </tbody>
                </StyledTaskTable>
              </StyledTabPanel>

              <div style={{ display: 'flex', flexDirection: 'column', gap: themeCssVariables.spacing[4] }}>
                <StyledSideCard>
                  <StyledSideCardHeader>
                    <StyledSideCardTitle>
                      <IconCalendar size={16} />
                      <span>{t`Today's Schedule`}</span>
                    </StyledSideCardTitle>
                    <StyledViewAll>{t`View All`} <IconChevronRight size={14} /></StyledViewAll>
                  </StyledSideCardHeader>
                  {myData?.announcementList?.slice(0, 3).map((item: any) => (
                    <StyledScheduleItem key={item.id}>
                      <StyledScheduleDot color="#3b82f6" />
                      <StyledScheduleInfo>
                        <StyledScheduleTitle>{item.title}</StyledScheduleTitle>
                        <StyledScheduleTime>{item.body}</StyledScheduleTime>
                      </StyledScheduleInfo>
                    </StyledScheduleItem>
                  ))}
                  {(!myData?.announcementList || myData.announcementList.length === 0) && (
                    <StyledScheduleItem>
                      <StyledScheduleInfo>
                        <StyledScheduleTitle>{t`No events today`}</StyledScheduleTitle>
                      </StyledScheduleInfo>
                    </StyledScheduleItem>
                  )}
                </StyledSideCard>

                <StyledSideCard>
                  <StyledSideCardHeader>
                    <StyledSideCardTitle>
                      <IconFile size={16} />
                      <span>{t`Recent Announcements`}</span>
                    </StyledSideCardTitle>
                    <StyledViewAll>{t`View All`} <IconChevronRight size={14} /></StyledViewAll>
                  </StyledSideCardHeader>
                  {myData?.announcementList?.slice(0, 3).map((item: any) => (
                    <StyledAnnouncementItem key={item.id}>
                      <StyledScheduleDot color="#f59e0b" />
                      <StyledScheduleInfo>
                        <StyledScheduleTitle>{item.title}</StyledScheduleTitle>
                        <StyledScheduleTime>
                          {item.publishAt
                            ? new Date(item.publishAt).toLocaleDateString()
                            : ''}
                        </StyledScheduleTime>
                      </StyledScheduleInfo>
                    </StyledAnnouncementItem>
                  ))}
                  {(!myData?.announcementList || myData.announcementList.length === 0) && (
                    <StyledAnnouncementItem>
                      <StyledScheduleInfo>
                        <StyledScheduleTitle>{t`No announcements`}</StyledScheduleTitle>
                      </StyledScheduleInfo>
                    </StyledAnnouncementItem>
                  )}
                </StyledSideCard>
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <StyledTabPanel>
              <StyledTabPanelHeader>
                <StyledTabPanelTitle>
                  <IconCalendarEvent size={18} />
                  <span>{t`My Attendance`}</span>
                </StyledTabPanelTitle>
                <StyledViewAll onClick={() => navigate('/attendance-leave')}>
                  {t`View Full Log`} <IconChevronRight size={14} />
                </StyledViewAll>
              </StyledTabPanelHeader>
              <StyledEmptyTabContent>
                <StyledEmptyTabIcon>
                  <IconCalendarEvent size={32} />
                </StyledEmptyTabIcon>
                <StyledEmptyTabTitle>{t`No attendance records today`}</StyledEmptyTabTitle>
                <StyledEmptyTabDescription>
                  {t`Clock in to start tracking your attendance. Your daily log will appear here.`}
                </StyledEmptyTabDescription>
              </StyledEmptyTabContent>
            </StyledTabPanel>
          )}

          {activeTab === 'leave' && (
            <StyledTabPanel>
              <StyledTabPanelHeader>
                <StyledTabPanelTitle>
                  <IconPlayerPlay size={18} />
                  <span>{t`My Leave Requests`}</span>
                </StyledTabPanelTitle>
                <StyledViewAll onClick={() => navigate('/attendance-leave')}>
                  {t`View All`} <IconChevronRight size={14} />
                </StyledViewAll>
              </StyledTabPanelHeader>
              {myData?.pendingLeaveRequestList?.length > 0 ? (
                <StyledTaskTable>
                  <thead>
                    <tr>
                      <StyledTh>{t`Type`}</StyledTh>
                      <StyledTh>{t`Duration`}</StyledTh>
                      <StyledTh>{t`Days`}</StyledTh>
                      <StyledTh>{t`Status`}</StyledTh>
                    </tr>
                  </thead>
                  <tbody>
                    {myData.pendingLeaveRequestList.map((leave: any) => (
                      <tr key={leave.id}>
                        <StyledTd>{leave.leaveTypeId}</StyledTd>
                        <StyledTd>
                          {new Date(leave.startDate).toLocaleDateString()} -{' '}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </StyledTd>
                        <StyledTd>{leave.days}</StyledTd>
                        <StyledTd>
                          <StyledStatusBadgeSmall status={leave.status}>
                            {leave.status}
                          </StyledStatusBadgeSmall>
                        </StyledTd>
                      </tr>
                    ))}
                  </tbody>
                </StyledTaskTable>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: themeCssVariables.font.color.tertiary }}>
                  {t`No leave requests yet.`}
                </div>
              )}
            </StyledTabPanel>
          )}

          {activeTab === 'payroll' && (
            <StyledTabPanel>
              <StyledTabPanelHeader>
                <StyledTabPanelTitle>
                  <IconCurrencyDollar size={18} />
                  <span>{t`My Payslips`}</span>
                </StyledTabPanelTitle>
              </StyledTabPanelHeader>
              {myData?.recentPayslipList?.length > 0 ? (
                <StyledTaskTable>
                  <thead>
                    <tr>
                      <StyledTh>{t`Period`}</StyledTh>
                      <StyledTh>{t`Net Pay`}</StyledTh>
                      <StyledTh>{t`Status`}</StyledTh>
                      <StyledTh>{t`Paid At`}</StyledTh>
                    </tr>
                  </thead>
                  <tbody>
                    {myData.recentPayslipList.map((payslip: any) => (
                      <tr key={payslip.id}>
                        <StyledTd>{payslip.payrollPeriodId}</StyledTd>
                        <StyledTd>{formatCurrency(payslip.netPayAmountMicros)}</StyledTd>
                        <StyledTd>
                          <StyledStatusBadgeSmall status={payslip.paymentStatus}>
                            {payslip.paymentStatus}
                          </StyledStatusBadgeSmall>
                        </StyledTd>
                        <StyledTd>
                          {payslip.paidAt
                            ? new Date(payslip.paidAt).toLocaleDateString()
                            : '--'}
                        </StyledTd>
                      </tr>
                    ))}
                  </tbody>
                </StyledTaskTable>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: themeCssVariables.font.color.tertiary }}>
                  {t`No payslips available yet.`}
                </div>
              )}
            </StyledTabPanel>
          )}

          {activeTab === 'performance' && (
            <StyledTabPanel>
              <StyledTabPanelHeader>
                <StyledTabPanelTitle>
                  <IconTrendingUp size={18} />
                  <span>{t`My Performance`}</span>
                </StyledTabPanelTitle>
              </StyledTabPanelHeader>
              <StyledEmptyTabContent>
                <StyledEmptyTabIcon>
                  <IconTrendingUp size={32} />
                </StyledEmptyTabIcon>
                <StyledEmptyTabTitle>{t`No performance data yet`}</StyledEmptyTabTitle>
                <StyledEmptyTabDescription>
                  {t`Performance reviews will appear here once configured by your manager.`}
                </StyledEmptyTabDescription>
              </StyledEmptyTabContent>
            </StyledTabPanel>
          )}

          {activeTab === 'documents' && (
            <StyledTabPanel>
              <StyledTabPanelHeader>
                <StyledTabPanelTitle>
                  <IconFileText size={18} />
                  <span>{t`My Documents`}</span>
                </StyledTabPanelTitle>
              </StyledTabPanelHeader>
              <StyledEmptyTabContent>
                <StyledEmptyTabIcon>
                  <IconFileText size={32} />
                </StyledEmptyTabIcon>
                <StyledEmptyTabTitle>{t`No documents yet`}</StyledEmptyTabTitle>
                <StyledEmptyTabDescription>
                  {t`Your documents and files will appear here.`}
                </StyledEmptyTabDescription>
              </StyledEmptyTabContent>
            </StyledTabPanel>
          )}
        </StyledTabContent>
      </StyledContainer>
    </PageContainer>
  );
};
