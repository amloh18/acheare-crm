import { useMemo } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useAllEmployeesAttendance } from '@/hr/hooks/useAdminAttendance';
import { IconClock } from 'twenty-ui/icon';

import {
  StyledCard,
  StyledCardTitle,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
  StyledTwoColumn,
  StyledMetricRow,
  StyledMetricLabel,
  StyledMetricValue,
  StyledProgressBar,
  StyledProgressSegment,
  StyledLegendDot,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

const formatCurrency = (amountMicros: number): string => {
  const amount = amountMicros / 1_000_000;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
};

const ATTENDANCE_COLORS = {
  onsite: themeCssVariables.color.green,
  late: themeCssVariables.color.orange,
  absent: themeCssVariables.color.red,
  onLeave: themeCssVariables.color.blue,
};

export const AdminOverviewTab = () => {
  const { t } = useLingui();

  const {
    records: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useFindManyRecords({
    objectNameSingular: CoreObjectNameSingular.Person,
  });

  const {
    records: opportunities,
    loading: opportunitiesLoading,
  } = useFindManyRecords({
    objectNameSingular: CoreObjectNameSingular.Opportunity,
  });

  const {
    records: requirements,
    loading: requirementsLoading,
  } = useFindManyRecords({
    objectNameSingular: 'requirement' as CoreObjectNameSingular,
  });

  const {
    records: submissions,
    loading: submissionsLoading,
  } = useFindManyRecords({
    objectNameSingular: 'candidateSubmission' as CoreObjectNameSingular,
  });

  const {
    data: attendanceData,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAllEmployeesAttendance({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    endDate: new Date().toISOString(),
  }) as { data: any; loading: boolean; error: any };

  const attendanceSummary = attendanceData?.getAllEmployeesAttendance ?? [];

  const isLoading =
    employeesLoading || opportunitiesLoading || requirementsLoading ||
    submissionsLoading || attendanceLoading;

  const hasError = employeesError || attendanceError;

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (hasError) {
    return (
      <DashboardErrorState
        title={t`Unable to load overview`}
        description={t`There was an error loading the dashboard data. Please try again.`}
      />
    );
  }

  const kpis = useMemo(() => {
    const activeJobs = requirements.filter(
      (r: any) => r.status === 'OPEN' || !r.status,
    ).length;

    const totalPipeline = opportunities.reduce((sum: number, opp: any) => {
      const amount = opp.amount?.amountMicros ?? 0;
      return sum + amount;
    }, 0);

    const totalOpenings = requirements.reduce(
      (sum: number, r: any) => sum + (r.numberOfOpenings ?? 0),
      0,
    );

    return {
      employeeCount: employees.length,
      activeJobs,
      applicationCount: submissions.length,
      pipelineValue: totalPipeline,
      totalOpenings,
    };
  }, [employees, opportunities, requirements, submissions]);

  const attendanceStats = useMemo(() => {
    if (!attendanceSummary || attendanceSummary.length === 0) {
      return { onsite: 0, late: 0, absent: 0, onLeave: 0, total: 0, rate: 0 };
    }
    const onsite = attendanceSummary.filter(
      (a: any) => a.status === 'PRESENT' || a.status === 'ONTIME',
    ).length;
    const late = attendanceSummary.filter(
      (a: any) => a.status === 'LATE',
    ).length;
    const absent = attendanceSummary.filter(
      (a: any) => a.status === 'ABSENT',
    ).length;
    const onLeave = attendanceSummary.filter(
      (a: any) => a.status === 'ON_LEAVE',
    ).length;
    const total = onsite + late + absent + onLeave;
    const rate = total > 0 ? Math.round(((onsite + late) / total) * 100) : 0;
    return { onsite, late, absent, onLeave, total, rate };
  }, [attendanceSummary]);

  const hasData =
    employees.length > 0 || opportunities.length > 0 || requirements.length > 0;

  if (!hasData) {
    return (
      <DashboardEmptyState
        title={t`No data yet`}
        description={t`Overview data will appear here once employees, opportunities, and jobs are added.`}
      />
    );
  }

  return (
    <>
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Employees`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.employeeCount}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Active Jobs`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.activeJobs}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Applications`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.applicationCount}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Pipeline`}</StyledKpiLabel>
          <StyledKpiValue>{formatCurrency(kpis.pipelineValue)}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Attendance`}</StyledKpiLabel>
          <StyledKpiValue>{attendanceStats.rate}%</StyledKpiValue>
        </StyledKpiCard>
      </StyledKpiGrid>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Company Attendance`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconClock size={16} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {attendanceStats.onsite} {t`Onsite Now`}
              </span>
            </div>

            <StyledProgressBar>
              {attendanceStats.total > 0 && (
                <>
                  <StyledProgressSegment
                    width={(attendanceStats.onsite / attendanceStats.total) * 100}
                    color={ATTENDANCE_COLORS.onsite}
                  />
                  <StyledProgressSegment
                    width={(attendanceStats.late / attendanceStats.total) * 100}
                    color={ATTENDANCE_COLORS.late}
                  />
                  <StyledProgressSegment
                    width={(attendanceStats.absent / attendanceStats.total) * 100}
                    color={ATTENDANCE_COLORS.absent}
                  />
                  <StyledProgressSegment
                    width={(attendanceStats.onLeave / attendanceStats.total) * 100}
                    color={ATTENDANCE_COLORS.onLeave}
                  />
                </>
              )}
            </StyledProgressBar>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <StyledMetricRow>
                <StyledMetricLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StyledLegendDot color={ATTENDANCE_COLORS.onsite} />
                  {t`Present`}
                </StyledMetricLabel>
                <StyledMetricValue>{attendanceStats.onsite}</StyledMetricValue>
              </StyledMetricRow>
              <StyledMetricRow>
                <StyledMetricLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StyledLegendDot color={ATTENDANCE_COLORS.late} />
                  {t`Late`}
                </StyledMetricLabel>
                <StyledMetricValue>{attendanceStats.late}</StyledMetricValue>
              </StyledMetricRow>
              <StyledMetricRow>
                <StyledMetricLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StyledLegendDot color={ATTENDANCE_COLORS.absent} />
                  {t`Absent`}
                </StyledMetricLabel>
                <StyledMetricValue>{attendanceStats.absent}</StyledMetricValue>
              </StyledMetricRow>
              <StyledMetricRow>
                <StyledMetricLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StyledLegendDot color={ATTENDANCE_COLORS.onLeave} />
                  {t`On Leave`}
                </StyledMetricLabel>
                <StyledMetricValue>{attendanceStats.onLeave}</StyledMetricValue>
              </StyledMetricRow>
            </div>
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Quick Stats`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <StyledMetricRow>
              <StyledMetricLabel>{t`Open Positions`}</StyledMetricLabel>
              <StyledMetricValue>{kpis.totalOpenings}</StyledMetricValue>
            </StyledMetricRow>
            <StyledMetricRow>
              <StyledMetricLabel>{t`Active Opportunities`}</StyledMetricLabel>
              <StyledMetricValue>{opportunities.length}</StyledMetricValue>
            </StyledMetricRow>
            <StyledMetricRow>
              <StyledMetricLabel>{t`Pending Applications`}</StyledMetricLabel>
              <StyledMetricValue>{kpis.applicationCount}</StyledMetricValue>
            </StyledMetricRow>
          </div>
        </StyledCard>
      </StyledTwoColumn>
    </>
  );
};
