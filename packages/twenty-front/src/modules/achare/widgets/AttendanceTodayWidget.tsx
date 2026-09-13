import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useNavigate } from 'react-router-dom';
import {
  IconClock,
  IconChevronRight,
  IconLogin2,
  IconLogout,
} from 'twenty-ui/icon';
import { useCheckInMutation } from '@/hr/hooks/useCheckInMutation';
import { useCheckOutMutation } from '@/hr/hooks/useCheckOutMutation';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useState } from 'react';

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitleWrap = styled.div`
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

const StyledStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledStatBox = styled.div<{ toneColor: string }>`
  background: ${themeCssVariables.background.secondary};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-radius: ${themeCssVariables.border.radius.sm};
  text-align: center;
  border-top: 2px solid ${({ toneColor }) => toneColor};
`;

const StyledStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledStatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
  margin-top: 2px;
`;

const StyledPunchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${themeCssVariables.spacing[2]};
  border-top: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledPunchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledPunchStatus = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledPunchTime = styled.div`
  font-size: 0.75rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledPunchButtons = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
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

interface AttendanceTodayWidgetProps {
  present?: number;
  late?: number;
  absent?: number;
  onLeave?: number;
  currentAttendanceStatus?: string;
}

export const AttendanceTodayWidget = ({
  present = 42,
  late = 3,
  absent = 2,
  onLeave = 4,
  currentAttendanceStatus = 'PRESENT',
}: AttendanceTodayWidgetProps) => {
  const navigate = useNavigate();
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [userStatus, setUserStatus] = useState(currentAttendanceStatus);
  const [checkInTime, setCheckInTime] = useState<string | null>(
    currentAttendanceStatus === 'PRESENT' ? '09:12 AM' : null,
  );

  const handleCheckIn = async () => {
    try {
      await checkIn({ variables: { input: {} } });
      setUserStatus('PRESENT');
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      enqueueSuccessSnackBar({ message: 'Checked in successfully' });
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : 'Check-in failed',
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut({ variables: { input: {} } });
      setUserStatus('CHECKED_OUT');
      enqueueSuccessSnackBar({ message: 'Checked out successfully' });
    } catch (err) {
      enqueueErrorSnackBar({
        message: err instanceof Error ? err.message : 'Check-out failed',
      });
    }
  };

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitleWrap>
          <IconClock size={18} />
          <span>Today's Attendance</span>
        </StyledTitleWrap>
        <StyledViewAll onClick={() => navigate('/objects/attendanceDays')}>
          <span>View Log</span>
          <IconChevronRight size={14} />
        </StyledViewAll>
      </StyledHeader>

      <StyledStatsRow>
        <StyledStatBox toneColor="#10b981">
          <StyledStatValue>{present}</StyledStatValue>
          <StyledStatLabel>Present</StyledStatLabel>
        </StyledStatBox>
        <StyledStatBox toneColor="#f59e0b">
          <StyledStatValue>{late}</StyledStatValue>
          <StyledStatLabel>Late</StyledStatLabel>
        </StyledStatBox>
        <StyledStatBox toneColor="#ef4444">
          <StyledStatValue>{absent}</StyledStatValue>
          <StyledStatLabel>Absent</StyledStatLabel>
        </StyledStatBox>
        <StyledStatBox toneColor="#8b5cf6">
          <StyledStatValue>{onLeave}</StyledStatValue>
          <StyledStatLabel>On Leave</StyledStatLabel>
        </StyledStatBox>
      </StyledStatsRow>

      <StyledPunchRow>
        <StyledPunchInfo>
          <StyledPunchStatus>
            Status: {userStatus === 'PRESENT' ? 'Clocked In' : 'Not Clocked In'}
          </StyledPunchStatus>
          <StyledPunchTime>
            {checkInTime ? `Punched in at ${checkInTime}` : 'Ready for duty'}
          </StyledPunchTime>
        </StyledPunchInfo>
        <StyledPunchButtons>
          <StyledActionButton
            variant="primary"
            disabled={userStatus === 'PRESENT'}
            onClick={handleCheckIn}
          >
            <IconLogin2 size={14} />
            <span>Clock In</span>
          </StyledActionButton>
          <StyledActionButton
            variant="secondary"
            disabled={userStatus !== 'PRESENT'}
            onClick={handleCheckOut}
          >
            <IconLogout size={14} />
            <span>Clock Out</span>
          </StyledActionButton>
        </StyledPunchButtons>
      </StyledPunchRow>
    </StyledCard>
  );
};
