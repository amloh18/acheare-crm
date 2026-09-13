import { useState } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconSearch,
  IconClock,
  IconLogin2,
  IconLogout,
  IconCalendar,
} from 'twenty-ui/icon';
import { useCheckInMutation } from '@/hr/hooks/useCheckInMutation';
import { useCheckOutMutation } from '@/hr/hooks/useCheckOutMutation';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
  box-sizing: border-box;
`;

const StyledHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMainHeading = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledSubHeading = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledKPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledStatCard = styled.div<{ barColor: string }>`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 4px solid ${({ barColor }) => barColor};
`;

const StyledStatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledStatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
`;

const StyledPunchCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledPunchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledPunchTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledPunchSub = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ variant }) =>
      variant === 'primary'
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.medium};
  background: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.font.color.primary
      : themeCssVariables.background.primary};
  color: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.primary};
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const StyledTableWrap = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  text-align: left;
`;

const StyledTh = styled.th`
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTd = styled.td`
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  color: ${themeCssVariables.font.color.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  vertical-align: middle;
`;

const StyledTr = styled.tr`
  &:last-of-type ${StyledTd} {
    border-bottom: none;
  }
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledPill = styled.span<{ type: string }>`
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ type }) =>
    type === 'PRESENT'
      ? 'rgba(16, 185, 129, 0.12)'
      : type === 'LATE'
      ? 'rgba(245, 158, 11, 0.12)'
      : 'rgba(239, 68, 68, 0.12)'};
  color: ${({ type }) =>
    type === 'PRESENT' ? '#10b981' : type === 'LATE' ? '#f59e0b' : '#ef4444'};
`;

interface AttendanceLogEntry {
  id: string;
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
}

const ATTENDANCE_LOG: AttendanceLogEntry[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    department: 'Engineering',
    checkIn: '09:05 AM',
    checkOut: '—',
    hoursWorked: '5h 30m',
    status: 'PRESENT',
  },
  {
    id: '2',
    name: 'Rohan Mehta',
    department: 'Design',
    checkIn: '09:12 AM',
    checkOut: '—',
    hoursWorked: '5h 23m',
    status: 'PRESENT',
  },
  {
    id: '3',
    name: 'Vikram Sengupta',
    department: 'Human Resources',
    checkIn: '09:48 AM',
    checkOut: '—',
    hoursWorked: '4h 47m',
    status: 'LATE',
  },
  {
    id: '4',
    name: 'Aditya Rao',
    department: 'Engineering',
    checkIn: '08:55 AM',
    checkOut: '—',
    hoursWorked: '5h 40m',
    status: 'PRESENT',
  },
  {
    id: '5',
    name: 'Meera Nambiar',
    department: 'Sales & BD',
    checkIn: '10:05 AM',
    checkOut: '—',
    hoursWorked: '4h 30m',
    status: 'LATE',
  },
  {
    id: '6',
    name: 'Tanya Bhardwaj',
    department: 'Finance',
    checkIn: '—',
    checkOut: '—',
    hoursWorked: '0h',
    status: 'ABSENT',
  },
];

export const AttendanceDashboardView = () => {
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [clockedIn, setClockedIn] = useState(true);

  const handleCheckIn = async () => {
    try {
      await checkIn({ variables: { input: {} } });
      setClockedIn(true);
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
      setClockedIn(false);
      enqueueSuccessSnackBar({ message: 'Clocked out successfully' });
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : 'Check-out failed',
      });
    }
  };

  return (
    <StyledContainer>
      <StyledHeaderRow>
        <StyledHeaderTitle>
          <StyledMainHeading>Attendance & Time Operations</StyledMainHeading>
          <StyledSubHeading>
            Real-time daily attendance monitoring, work hours and check-ins
          </StyledSubHeading>
        </StyledHeaderTitle>
      </StyledHeaderRow>

      <StyledKPIGrid>
        <StyledStatCard barColor="#10b981">
          <StyledStatValue>42 / 48</StyledStatValue>
          <StyledStatLabel>Present Today (87.5%)</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard barColor="#f59e0b">
          <StyledStatValue>3</StyledStatValue>
          <StyledStatLabel>Late Check-Ins</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard barColor="#ef4444">
          <StyledStatValue>1</StyledStatValue>
          <StyledStatLabel>Unplanned Absences</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard barColor="#8b5cf6">
          <StyledStatValue>2</StyledStatValue>
          <StyledStatLabel>Approved On-Leave</StyledStatLabel>
        </StyledStatCard>
      </StyledKPIGrid>

      <StyledPunchCard>
        <StyledPunchInfo>
          <StyledPunchTitle>Personal Punch Station</StyledPunchTitle>
          <StyledPunchSub>
            {clockedIn
              ? 'You clocked in at 09:12 AM today (Logged: 5h 23m)'
              : 'You are currently clocked out'}
          </StyledPunchSub>
        </StyledPunchInfo>
        <StyledButtonRow>
          <StyledButton
            variant="primary"
            disabled={clockedIn}
            onClick={handleCheckIn}
          >
            <IconLogin2 size={14} />
            <span>Clock In</span>
          </StyledButton>
          <StyledButton
            variant="secondary"
            disabled={!clockedIn}
            onClick={handleCheckOut}
          >
            <IconLogout size={14} />
            <span>Clock Out</span>
          </StyledButton>
        </StyledButtonRow>
      </StyledPunchCard>

      <StyledTableWrap>
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>Employee</StyledTh>
              <StyledTh>Department</StyledTh>
              <StyledTh>Punch In</StyledTh>
              <StyledTh>Punch Out</StyledTh>
              <StyledTh>Hours Worked</StyledTh>
              <StyledTh>Status</StyledTh>
            </tr>
          </thead>
          <tbody>
            {ATTENDANCE_LOG.map((row) => (
              <StyledTr key={row.id}>
                <StyledTd>
                  <strong>{row.name}</strong>
                </StyledTd>
                <StyledTd>{row.department}</StyledTd>
                <StyledTd>{row.checkIn}</StyledTd>
                <StyledTd>{row.checkOut}</StyledTd>
                <StyledTd>{row.hoursWorked}</StyledTd>
                <StyledTd>
                  <StyledPill type={row.status}>{row.status}</StyledPill>
                </StyledTd>
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
      </StyledTableWrap>
    </StyledContainer>
  );
};
