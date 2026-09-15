import { useMemo } from 'react';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import {
  useAllEmployeesAttendance,
  useAllLeaveRequests,
} from '@/hr/hooks/useAdminAttendance';
import { useNavigate } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  StyledCard,
  StyledCardTitle,
  StyledAlertCard,
  StyledAlertTitle,
  StyledAlertBody,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

type Insight = {
  severity: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  body: string;
  link?: string;
  linkLabel?: string;
};

export const AdminInsightsTab = () => {
  const { t } = useLingui();
  const navigate = useNavigate();

  const {
    records: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useFindManyRecords({
    objectNameSingular: 'employee' as CoreObjectNameSingular,
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
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 7),
    ).toISOString(),
    endDate: new Date().toISOString(),
  }) as { data: any; loading: boolean; error: any };

  const attendanceSummary = attendanceData?.getAllEmployeesAttendance ?? [];

  const {
    data: leaveData,
    loading: leaveLoading,
  } = useAllLeaveRequests() as { data: any; loading: boolean };

  const leaveRequests = leaveData?.getAllLeaveRequests ?? [];

  const isLoading =
    employeesLoading ||
    opportunitiesLoading ||
    requirementsLoading ||
    submissionsLoading ||
    attendanceLoading ||
    leaveLoading;

  const hasError = employeesError || attendanceError;

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (hasError) {
    return (
      <DashboardErrorState
        title={t`Unable to load insights`}
        description={t`There was an error loading insight data. Please try again.`}
      />
    );
  }

  const insights = useMemo<Insight[]>(() => {
    const items: Insight[] = [];

    const activeEmployees = employees.filter(
      (e: any) => e.status === 'ACTIVE' || !e.status,
    ).length;

    const totalPipeline = opportunities.reduce(
      (sum: number, o: any) => sum + (o.amount?.amountMicros ?? 0),
      0,
    );

    const wonOpps = opportunities.filter((o: any) => o.stage === 'CUSTOMER');
    const wonRevenue = wonOpps.reduce(
      (sum: number, o: any) => sum + (o.amount?.amountMicros ?? 0),
      0,
    );

    const attendanceRate = (() => {
      if (!attendanceSummary || attendanceSummary.length === 0) return 0;
      const present = attendanceSummary.filter(
        (a: any) => a.status === 'PRESENT' || a.status === 'LATE',
      ).length;
      return Math.round((present / attendanceSummary.length) * 100);
    })();

    const openPositions = requirements.filter(
      (r: any) => r.status === 'OPEN' || !r.status,
    ).length;

    const pendingLeaves = leaveRequests.filter(
      (l: any) => l.status === 'PENDING',
    ).length;

    if (attendanceRate < 90) {
      items.push({
        severity: 'danger',
        title: t`Attendance Below Target`,
        body: t`Current attendance rate is ${attendanceRate}%, which is below the 90% target. ${leaveRequests.filter((l: any) => l.status === 'APPROVED').length} employees are on approved leave today.`,
      });
    } else if (attendanceRate >= 95) {
      items.push({
        severity: 'success',
        title: t`Excellent Attendance`,
        body: t`Attendance rate is ${attendanceRate}%, exceeding the 95% benchmark. Team availability is strong.`,
      });
    }

    const pipelineAmount = totalPipeline / 1_000_000;
    if (pipelineAmount > 100) {
      items.push({
        severity: 'success',
        title: t`Strong Pipeline Growth`,
        body: t`Revenue pipeline is at $${pipelineAmount.toFixed(0)}K with ${opportunities.length} active opportunities. Won revenue stands at $${(wonRevenue / 1_000_000).toFixed(0)}K.`,
      });
    } else if (pipelineAmount < 50) {
      items.push({
        severity: 'warning',
        title: t`Pipeline Needs Attention`,
        body: t`Revenue pipeline is at $${pipelineAmount.toFixed(0)}K with ${opportunities.length} active opportunities. Consider focusing on business development.`,
      });
    }

    if (openPositions > 5) {
      items.push({
        severity: 'warning',
        title: t`Multiple Open Positions`,
        body: t`${openPositions} positions are currently open. ${submissions.length} candidates are in the pipeline. Prioritizing key roles may accelerate hiring.`,
      });
    }

    if (pendingLeaves > 3) {
      items.push({
        severity: 'info',
        title: t`Leave Requests Pending`,
        body: t`${pendingLeaves} leave requests are awaiting approval. Timely review helps maintain team planning accuracy.`,
        link: '/settings/attendance',
        linkLabel: t`Review Leaves`,
      });
    }

    if (items.length === 0) {
      items.push({
        severity: 'success',
        title: t`Company Health is Stable`,
        body: t`Headcount is growing steadily and attendance remains above 90%. Continue monitoring key metrics for optimal performance.`,
      });
    }

    return items;
  }, [
    employees,
    opportunities,
    requirements,
    submissions,
    attendanceSummary,
    leaveRequests,
    t,
  ]);

  const healthScore = useMemo(() => {
    let score = 50;
    if (attendanceSummary && attendanceSummary.length > 0) {
      const present = attendanceSummary.filter(
        (a: any) => a.status === 'PRESENT' || a.status === 'LATE',
      ).length;
      const rate = (present / attendanceSummary.length) * 100;
      if (rate >= 95) score += 20;
      else if (rate >= 90) score += 10;
      else if (rate < 85) score -= 10;
    }
    if (opportunities.length > 10) score += 10;
    if (
      requirements.filter((r: any) => r.status === 'OPEN' || !r.status)
        .length < 5
    )
      score += 10;
    return Math.min(Math.max(score, 0), 100);
  }, [attendanceSummary, opportunities, requirements]);

  const healthLabel = useMemo(() => {
    if (healthScore >= 80) return t`Excellent`;
    if (healthScore >= 60) return t`Good`;
    if (healthScore >= 40) return t`Fair`;
    return t`Needs Attention`;
  }, [healthScore, t]);

  const healthColor = useMemo(() => {
    if (healthScore >= 80) return '#10b981';
    if (healthScore >= 60) return '#3b82f6';
    if (healthScore >= 40) return '#f59e0b';
    return '#ef4444';
  }, [healthScore]);

  const hasData = employees.length > 0 || opportunities.length > 0;

  if (!hasData) {
    return (
      <DashboardEmptyState
        title={t`No insights yet`}
        description={t`AI-powered insights will appear here once data is available.`}
      />
    );
  }

  return (
    <>
      <StyledCard style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: healthColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {healthScore}
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: healthColor,
              }}
            >
              {healthLabel}
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                color: themeCssVariables.font.color.secondary,
              }}
            >
              {t`Company Health Score`}
            </span>
          </div>
        </div>
      </StyledCard>

      <StyledCard style={{ marginBottom: '16px' }}>
        <StyledCardTitle>{t`Company Summary`}</StyledCardTitle>
        <div
          style={{
            fontSize: '0.875rem',
            color: themeCssVariables.font.color.secondary,
            lineHeight: 1.6,
          }}
        >
          {t`Company health is ${healthLabel.toLowerCase()}. `}
          {employees.filter((e: any) => e.status === 'ACTIVE' || !e.status)
            .length > 0 &&
            t`Headcount is at ${employees.filter((e: any) => e.status === 'ACTIVE' || !e.status).length} active employees. `}
          {attendanceSummary &&
            attendanceSummary.length > 0 &&
            t`Attendance rate is ${Math.round(
              (attendanceSummary.filter(
                (a: any) => a.status === 'PRESENT' || a.status === 'LATE',
              ).length /
                attendanceSummary.length) *
                100,
            )}%. `}
          {requirements.filter((r: any) => r.status === 'OPEN' || !r.status)
            .length > 0 &&
            t`${requirements.filter((r: any) => r.status === 'OPEN' || !r.status).length} positions are currently open for hiring. `}
          {opportunities.length > 0 &&
            t`Revenue pipeline has ${opportunities.length} active opportunities.`}
        </div>
      </StyledCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {insights.map((insight, idx) => (
          <StyledAlertCard key={idx} severity={insight.severity}>
            <StyledAlertTitle>
              {insight.severity === 'danger' && '🔴 '}
              {insight.severity === 'warning' && '🟡 '}
              {insight.severity === 'success' && '🟢 '}
              {insight.severity === 'info' && '🔵 '}
              {insight.title}
            </StyledAlertTitle>
            <StyledAlertBody>{insight.body}</StyledAlertBody>
            {insight.link && (
              <button
                onClick={() => navigate(insight.link!)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: themeCssVariables.color.blue,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                {insight.linkLabel} →
              </button>
            )}
          </StyledAlertCard>
        ))}
      </div>
    </>
  );
};
