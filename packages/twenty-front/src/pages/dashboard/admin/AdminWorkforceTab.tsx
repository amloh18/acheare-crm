import { useMemo } from 'react';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import {
  useAllEmployeesAttendance,
  useAllLeaveRequests,
} from '@/hr/hooks/useAdminAttendance';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  StyledCard,
  StyledCardTitle,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
  StyledTwoColumn,
  StyledBarRow,
  StyledBarLabel,
  StyledBarTrack,
  StyledBarFill,
  StyledBarValue,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const AdminWorkforceTab = () => {
  const { t } = useLingui();

  const {
    records: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useFindManyRecords({
    objectNameSingular: 'employee' as CoreObjectNameSingular,
    recordGqlFields: {
      id: true,
      status: true,
      employmentType: true,
      joiningDate: true,
      department: { id: true, name: true },
    },
  });

  const {
    data: attendanceData,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAllEmployeesAttendance({
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 30),
    ).toISOString(),
    endDate: new Date().toISOString(),
  }) as { data: any; loading: boolean; error: any };

  const attendanceSummary = attendanceData?.getAllEmployeesAttendance ?? [];

  const {
    data: leaveData,
    loading: leaveLoading,
  } = useAllLeaveRequests() as { data: any; loading: boolean };

  const leaveRequests = leaveData?.getAllLeaveRequests ?? [];

  const isLoading = employeesLoading || attendanceLoading || leaveLoading;
  const hasError = employeesError || attendanceError;

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (hasError) {
    return (
      <DashboardErrorState
        title={t`Unable to load workforce data`}
        description={t`There was an error loading workforce analytics. Please try again.`}
      />
    );
  }

  const kpis = (() => {
    const activeEmployees = employees.filter(
      (e: any) => e.status === 'ACTIVE' || !e.status,
    ).length;

    const newHiresThisMonth = employees.filter((e: any) => {
      if (!e.joiningDate) return false;
      const joinDate = new Date(e.joiningDate);
      const now = new Date();
      return (
        joinDate.getMonth() === now.getMonth() &&
        joinDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const attendanceRate = (() => {
      if (!attendanceSummary || attendanceSummary.length === 0) return 0;
      const present = attendanceSummary.filter(
        (a: any) => a.status === 'PRESENT' || a.status === 'LATE',
      ).length;
      return Math.round((present / attendanceSummary.length) * 100);
    })();

    const onLeaveCount = leaveRequests.filter(
      (l: any) => l.status === 'APPROVED',
    ).length;

    return {
      headcount: activeEmployees,
      newHires: newHiresThisMonth,
      attendanceRate,
      onLeave: onLeaveCount,
    };
  })();

  const departmentDistribution = (() => {
    const dist: Record<string, number> = {};
    for (const emp of employees) {
      const dept = (emp as any).department?.name ?? 'Unassigned';
      dist[dept] = (dist[dept] ?? 0) + 1;
    }
    const total = employees.length || 1;
    return Object.entries(dist)
      .map(([name, count]) => ({
        name,
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  })();

  const headcountTrend = (() => {
    const monthly: number[] = new Array(12).fill(0);
    for (const emp of employees) {
      if ((emp as any).joiningDate) {
        const month = new Date((emp as any).joiningDate).getMonth();
        for (let i = month; i < 12; i++) {
          monthly[i]++;
        }
      }
    }
    return monthly;
  })();

  const maxHeadcount = Math.max(...headcountTrend, 1);

  const leaveBreakdown = (() => {
    const breakdown: Record<string, number> = {};
    for (const req of leaveRequests) {
      const type = (req as any).leaveType?.name ?? 'Annual Leave';
      breakdown[type] = (breakdown[type] ?? 0) + ((req as any).days ?? 0);
    }
    return Object.entries(breakdown)
      .map(([type, days]) => ({ type, days }))
      .sort((a, b) => b.days - a.days);
  })();

  const attendanceTrend = (() => {
    if (!attendanceSummary) return new Array(12).fill(90);
    const present = attendanceSummary.filter(
      (a: any) => a.status === 'PRESENT' || a.status === 'LATE',
    ).length;
    const total = attendanceSummary.length || 1;
    const rate = Math.round((present / total) * 100);
    return new Array(12).fill(rate);
  })();

  const hasData = employees.length > 0;

  if (!hasData) {
    return (
      <DashboardEmptyState
        title={t`No workforce data yet`}
        description={t`Workforce analytics will appear here once employees are added.`}
      />
    );
  }

  return (
    <>
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Headcount`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.headcount}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`New Hires`}</StyledKpiLabel>
          <StyledKpiValue>+{kpis.newHires}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Attendance`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.attendanceRate}%</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`On Leave`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.onLeave}</StyledKpiValue>
        </StyledKpiCard>
      </StyledKpiGrid>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Headcount Trend`}</StyledCardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '80px',
            }}
          >
            {headcountTrend.map((count, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: themeCssVariables.font.color.tertiary,
                  }}
                >
                  {count > 0 ? count : ''}
                </span>
                <div
                  style={{
                    width: '100%',
                    height: `${(count / maxHeadcount) * 60}px`,
                    background: themeCssVariables.color.blue,
                    borderRadius: '2px 2px 0 0',
                    minHeight: '2px',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: themeCssVariables.font.color.tertiary,
                  }}
                >
                  {MONTHS[idx]}
                </span>
              </div>
            ))}
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Department Distribution`}</StyledCardTitle>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {departmentDistribution.length === 0 ? (
              <div
                style={{
                  color: themeCssVariables.font.color.tertiary,
                  fontSize: '0.875rem',
                  padding: '16px 0',
                  textAlign: 'center',
                }}
              >
                {t`No department data`}
              </div>
            ) : (
              departmentDistribution.map((dept) => (
                <StyledBarRow key={dept.name}>
                  <StyledBarLabel>{dept.name}</StyledBarLabel>
                  <StyledBarTrack>
                    <StyledBarFill width={dept.pct} />
                  </StyledBarTrack>
                  <StyledBarValue>{dept.count}</StyledBarValue>
                </StyledBarRow>
              ))
            )}
          </div>
        </StyledCard>
      </StyledTwoColumn>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Attendance Trend`}</StyledCardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '60px',
            }}
          >
            {attendanceTrend.map((rate, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: themeCssVariables.font.color.tertiary,
                  }}
                >
                  {rate}%
                </span>
                <div
                  style={{
                    width: '100%',
                    height: `${(rate / 100) * 50}px`,
                    background: themeCssVariables.color.green,
                    borderRadius: '2px 2px 0 0',
                    minHeight: '2px',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: themeCssVariables.font.color.tertiary,
                  }}
                >
                  {MONTHS[idx]}
                </span>
              </div>
            ))}
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Leave Trends`}</StyledCardTitle>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {leaveBreakdown.length === 0 ? (
              <div
                style={{
                  color: themeCssVariables.font.color.tertiary,
                  fontSize: '0.875rem',
                  padding: '16px 0',
                  textAlign: 'center',
                }}
              >
                {t`No leave data`}
              </div>
            ) : (
              leaveBreakdown.map((leave) => (
                <StyledBarRow key={leave.type}>
                  <StyledBarLabel>{leave.type}</StyledBarLabel>
                  <StyledBarTrack>
                    <StyledBarFill
                      width={
                        Math.max(
                          ...leaveBreakdown.map((l) => l.days),
                          1,
                        ) > 0
                          ? (leave.days /
                              Math.max(
                                ...leaveBreakdown.map((l) => l.days),
                                1,
                              )) *
                            100
                          : 0
                      }
                      color={themeCssVariables.color.blue}
                    />
                  </StyledBarTrack>
                  <StyledBarValue>
                    {leave.days} {t`days`}
                  </StyledBarValue>
                </StyledBarRow>
              ))
            )}
          </div>
        </StyledCard>
      </StyledTwoColumn>
    </>
  );
};
