import { useMemo } from 'react';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
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
  StyledFunnelStep,
  StyledFunnelBar,
  StyledFunnelLabel,
  StyledFunnelValue,
  StyledFunnelRate,
  StyledAlertCard,
  StyledAlertTitle,
  StyledAlertBody,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

type RequirementRecord = {
  id: string;
  title?: string;
  status?: string;
  numberOfOpenings?: number;
  receivedAt?: string;
};

type CandidateSubmissionRecord = {
  id: string;
  stage?: string;
  createdAt?: string;
};

type InterviewRecord = {
  id: string;
  status?: string;
};

const FUNNEL_STAGES = ['APPLICATION', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];

const STAGE_LABELS: Record<string, string> = {
  APPLICATION: 'Applications',
  SCREENING: 'Screened',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
};

export const AdminHiringTab = () => {
  const { t } = useLingui();

  const {
    records: requirements,
    loading: requirementsLoading,
    error: requirementsError,
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
    records: interviews,
    loading: interviewsLoading,
  } = useFindManyRecords({
    objectNameSingular: 'interview' as CoreObjectNameSingular,
  });

  const isLoading = requirementsLoading || submissionsLoading || interviewsLoading;
  const hasError = requirementsError;

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (hasError) {
    return (
      <DashboardErrorState
        title={t`Unable to load hiring data`}
        description={t`There was an error loading hiring analytics. Please try again.`}
      />
    );
  }

  const kpis = (() => {
    const openPositions = requirements.filter(
      (r: any) => r.status === 'OPEN' || !r.status,
    ).length;

    const hiredThisMonth = submissions.filter((s: any) => {
      if (s.stage !== 'HIRED' || !s.createdAt) return false;
      const d = new Date(s.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      openPositions,
      candidates: submissions.length,
      interviews: interviews.length,
      hiredThisMonth,
    };
  })();

  const funnelData = (() => {
    const counts: Record<string, number> = {};
    for (const stage of FUNNEL_STAGES) {
      counts[stage] = 0;
    }
    for (const sub of submissions) {
      const stage = (sub as any).stage ?? 'APPLICATION';
      if (!counts[stage]) counts[stage] = 0;
      counts[stage]++;
    }
    return counts;
  })();

  const maxFunnelCount = Math.max(...Object.values(funnelData), 1);

  const sourceBreakdown = (() => {
    const counts: Record<string, number> = {};
    for (const sub of submissions) {
      const source = (sub as any).candidate?.source ?? 'Unknown';
      counts[source] = (counts[source] ?? 0) + 1;
    }
    const total = submissions.length || 1;
    return Object.entries(counts)
      .map(([source, count]) => ({
        source,
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  })();

  const bottleneckAlert = (() => {
    const avgTime = 24;
    const bottlenecks: string[] = [];
    for (const req of requirements) {
      if ((req as any).receivedAt) {
        const daysSince = Math.round(
          (Date.now() - new Date((req as any).receivedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (daysSince > avgTime * 1.3) {
          bottlenecks.push(
            `${(req as any).title ?? 'Position'} has been open for ${daysSince} days`,
          );
        }
      }
    }
    return bottlenecks;
  })();

  const hasData = requirements.length > 0 || submissions.length > 0;

  if (!hasData) {
    return (
      <DashboardEmptyState
        title={t`No hiring data yet`}
        description={t`Hiring analytics will appear here once requirements and applications are added.`}
      />
    );
  }

  return (
    <>
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Open Positions`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.openPositions}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Candidates`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.candidates}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Interviews`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.interviews}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Hires This Month`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.hiredThisMonth}</StyledKpiValue>
        </StyledKpiCard>
      </StyledKpiGrid>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Hiring Funnel`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {FUNNEL_STAGES.map((stage, idx) => {
              const count = funnelData[stage] ?? 0;
              const pct = maxFunnelCount > 0 ? (count / maxFunnelCount) * 100 : 0;
              const prevCount = funnelData[FUNNEL_STAGES[idx - 1]] ?? 0;
              const convRate =
                idx > 0 && prevCount > 0
                  ? Math.round((count / prevCount) * 100)
                  : 100;
              return (
                <div key={stage}>
                  <StyledFunnelStep>
                    <StyledFunnelBar width={Math.max(pct, 5)}>
                      <StyledFunnelLabel>{count}</StyledFunnelLabel>
                    </StyledFunnelBar>
                    <StyledFunnelValue>{STAGE_LABELS[stage]}</StyledFunnelValue>
                    <StyledFunnelRate>
                      {idx > 0 ? `${convRate}%` : ''}
                    </StyledFunnelRate>
                  </StyledFunnelStep>
                </div>
              );
            })}
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Candidate Sources`}</StyledCardTitle>
          {sourceBreakdown.length === 0 ? (
            <div
              style={{
                color: themeCssVariables.font.color.tertiary,
                fontSize: '0.875rem',
                padding: '16px 0',
                textAlign: 'center',
              }}
            >
              {t`No source data available`}
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {sourceBreakdown.map((src) => (
                <StyledBarRow key={src.source}>
                  <StyledBarLabel>{src.source}</StyledBarLabel>
                  <StyledBarTrack>
                    <StyledBarFill width={src.pct} />
                  </StyledBarTrack>
                  <StyledBarValue>{src.pct}%</StyledBarValue>
                </StyledBarRow>
              ))}
            </div>
          )}
        </StyledCard>
      </StyledTwoColumn>

      {bottleneckAlert.length > 0 && (
        <StyledCard>
          <StyledCardTitle>{t`Hiring Bottlenecks`}</StyledCardTitle>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {bottleneckAlert.map((alert, idx) => (
              <StyledAlertCard key={idx} severity="warning">
                <StyledAlertTitle>
                  ⚠️ {t`Attention Needed`}
                </StyledAlertTitle>
                <StyledAlertBody>{alert}</StyledAlertBody>
              </StyledAlertCard>
            ))}
          </div>
        </StyledCard>
      )}
    </>
  );
};
