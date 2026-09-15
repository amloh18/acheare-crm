import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useState, useMemo, useCallback } from 'react';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconClock,
  IconCalendar,
  IconDownload,
  IconFilter,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconCheck,
  IconX,
} from 'twenty-ui/icon';
import { Button } from 'twenty-ui/input';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { ModalStatefulWrapper } from '@/ui/layout/modal/components/ModalStatefulWrapper';

import { useAchareRole } from '@/achare/hooks/useAchareRole';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { useSettingsActiveTabId } from '@/settings/components/layout/useSettingsActiveTabId';
import {
  useAllEmployeesAttendance,
  useAllLeaveRequests,
  useLeaveTypes,
  useEmployeeLeaveBalance,
  useApproveLeaveRequest,
  useRejectLeaveRequest,
} from '@/hr/hooks/useAdminAttendance';
import { useRequestLeaveMutation } from '@/hr/hooks/useRequestLeaveMutation';
import { useMyWorkspaceData } from '@/hr/hooks/useMyWorkspaceData';

const ATTENDANCE_LEAVE_TABS = [
  { id: 'attendance', title: 'Attendance', Icon: IconClock },
  { id: 'leave', title: 'Leave', Icon: IconCalendar },
];

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${themeCssVariables.spacing[3]};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
`;

const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledCardIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
`;

const StyledCardTitle = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledCardValue = styled.span`
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledCardSubtext = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledSearchFilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[3]};
  padding: 0 ${themeCssVariables.spacing[4]};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledSearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  flex: 1;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: ${themeCssVariables.font.size.sm};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledDateSelector = styled.button`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledActiveFilters = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledFilterChip = styled.button`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledAttendanceGrid = styled.div`
  padding: 0 ${themeCssVariables.spacing[4]};
  overflow-x: auto;
`;

const StyledGrid = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledGridHeader = styled.th`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: left;
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledGridCell = styled.td`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledEmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${themeCssVariables.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledEmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledEmployeeName = styled.span`
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledEmployeeRole = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};

  ${({ $status }) => {
    switch ($status) {
      case 'present':
        return `
          background: #10b98115;
          color: #10b981;
        `;
      case 'late':
        return `
          background: #f59e0b15;
          color: #f59e0b;
        `;
      case 'absent':
        return `
          background: #ef444415;
          color: #ef4444;
        `;
      case 'leave':
        return `
          background: #8b5cf615;
          color: #8b5cf6;
        `;
      case 'active':
        return `
          background: #3b82f615;
          color: #3b82f6;
        `;
      default:
        return `
          background: ${themeCssVariables.background.secondary};
          color: ${themeCssVariables.font.color.secondary};
        `;
    }
  }}
`;

const StyledDayColumn = styled.td`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  text-align: center;
`;

const StyledDayNumber = styled.span`
  display: block;
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.secondary};
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  border-top: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledPaginationInfo = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledPaginationButtons = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledPageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};

  ${({ $active }) =>
    $active
      ? `
    background: ${themeCssVariables.font.color.primary};
    color: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.font.color.primary};
  `
      : `
    background: ${themeCssVariables.background.primary};
    color: ${themeCssVariables.font.color.primary};
    
    &:hover {
      background: ${themeCssVariables.background.secondary};
    }
  `}
`;

const StyledTabContainer = styled.div`
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
  min-width: 400px;
`;

const StyledTitle = styled.h2`
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledLabel = styled.label`
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledInput = styled.input`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
  background: ${themeCssVariables.background.primary};

  &:focus {
    outline: none;
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledSelect = styled.select`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
  background: ${themeCssVariables.background.primary};

  &:focus {
    outline: none;
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTextArea = styled.textarea`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.primary};
  background: ${themeCssVariables.background.primary};
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${themeCssVariables.font.color.primary};
  }
`;

const COMPONENT_INSTANCE_ID = 'attendance-leave-tabs';
const REQUEST_LEAVE_MODAL_ID = 'request-leave-modal';

export const AttendanceLeavePage = () => {
  const { t } = useLingui();
  const { role } = useAchareRole();
  const activeTabId = useSettingsActiveTabId(
    COMPONENT_INSTANCE_ID,
    ATTENDANCE_LEAVE_TABS.map((tab) => tab.id),
  );

  const isAdmin = role === 'admin' || role === 'hr';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { openModal, closeModal } = useModal();
  const [requestLeave] = useRequestLeaveMutation();
  const [approveLeaveRequest] = useApproveLeaveRequest();
  const [rejectLeaveRequest] = useRejectLeaveRequest();

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const { data: attendanceData, loading: attendanceLoading } = useAllEmployeesAttendance({
    startDate: startOfWeek.toISOString(),
    endDate: endOfWeek.toISOString(),
    departmentId: departmentFilter || undefined,
    status: statusFilter || undefined,
  }) as { data: any; loading: boolean };

  const { data: leaveData, loading: leaveLoading } = useAllLeaveRequests({
    status: statusFilter || undefined,
  }) as { data: any; loading: boolean };

  const { data: leaveTypesData } = useLeaveTypes() as { data: any };
  const { data: myWorkspaceData } = useMyWorkspaceData() as { data: any };

  const [leaveForm, setLeaveForm] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleRequestLeave = useCallback(async () => {
    if (!myWorkspaceData?.myWorkspaceData?.employeeId) return;

    try {
      await requestLeave({
        variables: {
          input: {
            employeeId: myWorkspaceData.myWorkspaceData.employeeId,
            leaveTypeId: leaveForm.leaveTypeId,
            startDate: leaveForm.startDate,
            endDate: leaveForm.endDate,
            reason: leaveForm.reason,
          },
        },
      });

      closeModal(REQUEST_LEAVE_MODAL_ID);
      setLeaveForm({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error('Failed to request leave:', error);
    }
  }, [leaveForm, myWorkspaceData, requestLeave, closeModal]);

  const handleApproveLeave = useCallback(async (leaveRequestId: string) => {
    try {
      await approveLeaveRequest({ variables: { leaveRequestId } });
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  }, [approveLeaveRequest]);

  const handleRejectLeave = useCallback(async (leaveRequestId: string) => {
    try {
      await rejectLeaveRequest({
        variables: { leaveRequestId, reviewNotes: 'Rejected by admin' },
      });
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
  }, [rejectLeaveRequest]);

  const filteredEmployees = useMemo(() => {
    if (!attendanceData?.allEmployeesAttendance?.employees) return [];

    return attendanceData.allEmployeesAttendance.employees.filter((emp: any) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [attendanceData, searchQuery]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleExport = useCallback(() => {
    if (!attendanceData?.allEmployeesAttendance?.employees) return;

    const csvContent = [
      ['Employee', 'Department', 'Role', ...Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`)],
      ...attendanceData.allEmployeesAttendance.employees.map((emp: any) => [
        emp.name,
        emp.departmentName || '',
        emp.role || '',
        ...emp.days.map((day: any) => day.status || ''),
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [attendanceData]);

  const summary = attendanceData?.allEmployeesAttendance;

  return (
    <PageContainer>
      <PageCardLayout
        header={
          <PageCardHeader
            icon={<IconClock size={themeCssVariables.icon.size.md} />}
            title={t`Attendance & Leave`}
            actionButton={
              isAdmin ? (
                <Button
                  variant="secondary"
                  Icon={IconDownload}
                  onClick={handleExport}
                  title={t`Download`}
                />
              ) : (
                <Button
                  variant="primary"
                  Icon={IconPlus}
                  onClick={() => openModal(REQUEST_LEAVE_MODAL_ID)}
                  title={t`Request Leave`}
                />
              )
            }
          />
        }
      >
        <StyledContent>

          {isAdmin && summary && (
            <StyledSummaryGrid>
              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#10b981">
                    <IconClock size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`Present Today`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>{summary.presentToday}</StyledCardValue>
                <StyledCardSubtext>
                  {t`${summary.totalEmployees - summary.presentToday} People Remaining`}
                </StyledCardSubtext>
              </StyledSummaryCard>

              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#f59e0b">
                    <IconClock size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`Late Entry`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>{summary.lateEntry}</StyledCardValue>
                <StyledCardSubtext>{t`${summary.presentToday - summary.lateEntry} People are on Time`}</StyledCardSubtext>
              </StyledSummaryCard>

              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#8b5cf6">
                    <IconCalendar size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`On Leave`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>{summary.onLeave}</StyledCardValue>
                <StyledCardSubtext>{t`Approved Leave`}</StyledCardSubtext>
              </StyledSummaryCard>

              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#ef4444">
                    <IconClock size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`Absent`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>{summary.absent}</StyledCardValue>
                <StyledCardSubtext>{t`Without Informing`}</StyledCardSubtext>
              </StyledSummaryCard>
            </StyledSummaryGrid>
          )}

          {!isAdmin && myWorkspaceData?.myWorkspaceData && (
            <StyledSummaryGrid>
              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#3b82f6">
                    <IconCalendar size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`Attendance Today`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>
                  {myWorkspaceData.myWorkspaceData.attendanceStatus || 'Not Checked In'}
                </StyledCardValue>
                <StyledCardSubtext>
                  {myWorkspaceData.myWorkspaceData.firstCheckIn
                    ? t`Checked in at ${new Date(myWorkspaceData.myWorkspaceData.firstCheckIn).toLocaleTimeString()}`
                    : t`No check-in today`}
                </StyledCardSubtext>
              </StyledSummaryCard>

              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#10b981">
                    <IconClock size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`Worked Today`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>
                  {myWorkspaceData.myWorkspaceData.workedMinutes
                    ? `${Math.floor(myWorkspaceData.myWorkspaceData.workedMinutes / 60)}h ${myWorkspaceData.myWorkspaceData.workedMinutes % 60}m`
                    : '0h 0m'}
                </StyledCardValue>
                <StyledCardSubtext>{t`Total worked time`}</StyledCardSubtext>
              </StyledSummaryCard>

              <StyledSummaryCard>
                <StyledCardHeader>
                  <StyledCardIcon $color="#f59e0b">
                    <IconCalendar size={16} />
                  </StyledCardIcon>
                  <StyledCardTitle>{t`Pending Requests`}</StyledCardTitle>
                </StyledCardHeader>
                <StyledCardValue>{myWorkspaceData.myWorkspaceData.pendingLeaveRequests}</StyledCardValue>
                <StyledCardSubtext>{t`Awaiting approval`}</StyledCardSubtext>
              </StyledSummaryCard>
            </StyledSummaryGrid>
          )}

          <StyledTabContainer>
            <TabList
              tabs={ATTENDANCE_LEAVE_TABS}
              componentInstanceId={COMPONENT_INSTANCE_ID}
            />
          </StyledTabContainer>

          <StyledSearchFilterBar>
            <StyledSearchInput>
              <IconSearch size={16} />
              <input
                type="text"
                placeholder={isAdmin ? t`Search anything ...` : t`Search leave information`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </StyledSearchInput>
            <StyledFilterButton>
              <IconFilter size={16} />
              {t`Filter`}
            </StyledFilterButton>
            <StyledDateSelector>
              <IconCalendar size={16} />
              {startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </StyledDateSelector>
          </StyledSearchFilterBar>

          {isAdmin && statusFilter && (
            <StyledActiveFilters>
              <StyledFilterChip onClick={() => setStatusFilter('')}>
                {statusFilter}
                <IconX size={12} />
              </StyledFilterChip>
            </StyledActiveFilters>
          )}

          {isAdmin && activeTabId === 'attendance' && (
            <StyledAttendanceGrid>
              <StyledGrid>
                <thead>
                  <tr>
                    <StyledGridHeader>{t`Employee`}</StyledGridHeader>
                    <StyledGridHeader>{t`Sunday`}</StyledGridHeader>
                    <StyledGridHeader>{t`Monday`}</StyledGridHeader>
                    <StyledGridHeader>{t`Tuesday`}</StyledGridHeader>
                    <StyledGridHeader>{t`Wednesday`}</StyledGridHeader>
                    <StyledGridHeader>{t`Thursday`}</StyledGridHeader>
                    <StyledGridHeader>{t`Friday`}</StyledGridHeader>
                    <StyledGridHeader>{t`Saturday`}</StyledGridHeader>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLoading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                        {t`Loading...`}
                      </td>
                    </tr>
                  ) : paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                        {t`No employees found`}
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((employee: any) => (
                      <tr key={employee.employeeId}>
                        <StyledGridCell>
                          <StyledEmployeeCell>
                            <StyledAvatar>{employee.initials}</StyledAvatar>
                            <StyledEmployeeInfo>
                              <StyledEmployeeName>{employee.name}</StyledEmployeeName>
                              <StyledEmployeeRole>{employee.departmentName || employee.role}</StyledEmployeeRole>
                            </StyledEmployeeInfo>
                          </StyledEmployeeCell>
                        </StyledGridCell>
                        {employee.days.map((day: any, index: number) => (
                          <StyledDayColumn key={index}>
                            <StyledDayNumber>{day.day}</StyledDayNumber>
                            {day.status && (
                              <StyledStatusBadge $status={day.status}>
                                {day.hours}
                              </StyledStatusBadge>
                            )}
                          </StyledDayColumn>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </StyledGrid>
            </StyledAttendanceGrid>
          )}

          {isAdmin && activeTabId === 'leave' && (
            <StyledAttendanceGrid>
              <StyledGrid>
                <thead>
                  <tr>
                    <StyledGridHeader>{t`Employee`}</StyledGridHeader>
                    <StyledGridHeader>{t`Leave Type`}</StyledGridHeader>
                    <StyledGridHeader>{t`Date`}</StyledGridHeader>
                    <StyledGridHeader>{t`Duration`}</StyledGridHeader>
                    <StyledGridHeader>{t`Reason`}</StyledGridHeader>
                    <StyledGridHeader>{t`Status`}</StyledGridHeader>
                    <StyledGridHeader>{t`Actions`}</StyledGridHeader>
                  </tr>
                </thead>
                <tbody>
                  {leaveLoading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                        {t`Loading...`}
                      </td>
                    </tr>
                  ) : !leaveData?.allLeaveRequests?.requests?.length ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                        {t`No leave requests found`}
                      </td>
                    </tr>
                  ) : (
                    leaveData.allLeaveRequests.requests.map((leave: any) => (
                      <tr key={leave.id}>
                        <StyledGridCell>
                          <StyledEmployeeCell>
                            <StyledEmployeeName>{leave.employeeName}</StyledEmployeeName>
                          </StyledEmployeeCell>
                        </StyledGridCell>
                        <StyledGridCell>{leave.leaveTypeName}</StyledGridCell>
                        <StyledGridCell>
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </StyledGridCell>
                        <StyledGridCell>{leave.days} days</StyledGridCell>
                        <StyledGridCell>{leave.reason}</StyledGridCell>
                        <StyledGridCell>
                          <StyledStatusBadge $status={leave.status.toLowerCase()}>
                            {leave.status}
                          </StyledStatusBadge>
                        </StyledGridCell>
                        <StyledGridCell>
                          {leave.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <Button
                                variant="primary"
                                Icon={IconCheck}
                                onClick={() => handleApproveLeave(leave.id)}
                                title={t`Approve`}
                              />
                              <Button
                                variant="secondary"
                                Icon={IconX}
                                onClick={() => handleRejectLeave(leave.id)}
                                title={t`Reject`}
                              />
                            </div>
                          )}
                        </StyledGridCell>
                      </tr>
                    ))
                  )}
                </tbody>
              </StyledGrid>
            </StyledAttendanceGrid>
          )}

          {!isAdmin && activeTabId === 'leave' && (
            <StyledAttendanceGrid>
              <StyledGrid>
                <thead>
                  <tr>
                    <StyledGridHeader>{t`Leave Type`}</StyledGridHeader>
                    <StyledGridHeader>{t`Date`}</StyledGridHeader>
                    <StyledGridHeader>{t`Duration`}</StyledGridHeader>
                    <StyledGridHeader>{t`Reason`}</StyledGridHeader>
                    <StyledGridHeader>{t`Status`}</StyledGridHeader>
                  </tr>
                </thead>
                <tbody>
                  {myWorkspaceData?.myWorkspaceData?.pendingLeaveRequestList?.map((leave: any) => (
                    <tr key={leave.id}>
                      <StyledGridCell>{leave.leaveTypeId}</StyledGridCell>
                      <StyledGridCell>
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </StyledGridCell>
                      <StyledGridCell>{leave.days} days</StyledGridCell>
                      <StyledGridCell>{leave.reason}</StyledGridCell>
                      <StyledGridCell>
                        <StyledStatusBadge $status={leave.status?.toLowerCase() || 'pending'}>
                          {leave.status}
                        </StyledStatusBadge>
                      </StyledGridCell>
                    </tr>
                  ))}
                </tbody>
              </StyledGrid>
            </StyledAttendanceGrid>
          )}

          {isAdmin && (
            <StyledPagination>
              <StyledPaginationInfo>
                {t`Show ${paginatedEmployees.length} from ${filteredEmployees.length} data`}
              </StyledPaginationInfo>
              <StyledPaginationButtons>
                <StyledPageButton
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft size={16} />
                </StyledPageButton>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <StyledPageButton
                    key={page}
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </StyledPageButton>
                ))}
                <StyledPageButton
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight size={16} />
                </StyledPageButton>
              </StyledPaginationButtons>
            </StyledPagination>
          )}
        </StyledContent>
      </PageCardLayout>

      <ModalStatefulWrapper
        modalInstanceId={REQUEST_LEAVE_MODAL_ID}
        isClosable
        onClose={() => closeModal(REQUEST_LEAVE_MODAL_ID)}
      >
        <StyledModalContent>
          <StyledTitle>{t`Request Leave`}</StyledTitle>
          <StyledFormGroup>
            <StyledLabel>{t`Leave Type`}</StyledLabel>
            <StyledSelect
              value={leaveForm.leaveTypeId}
              onChange={(e) => setLeaveForm({ ...leaveForm, leaveTypeId: e.target.value })}
            >
              <option value="">{t`Select leave type`}</option>
              {leaveTypesData?.leaveTypes?.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </StyledSelect>
          </StyledFormGroup>

          <StyledFormGroup>
            <StyledLabel>{t`Start Date`}</StyledLabel>
            <StyledInput
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
            />
          </StyledFormGroup>

          <StyledFormGroup>
            <StyledLabel>{t`End Date`}</StyledLabel>
            <StyledInput
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
            />
          </StyledFormGroup>

          <StyledFormGroup>
            <StyledLabel>{t`Reason`}</StyledLabel>
            <StyledTextArea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder={t`Enter reason for leave`}
            />
          </StyledFormGroup>

          <Button
            variant="primary"
            onClick={handleRequestLeave}
            title={t`Submit Request`}
          />
        </StyledModalContent>
      </ModalStatefulWrapper>
    </PageContainer>
  );
};
