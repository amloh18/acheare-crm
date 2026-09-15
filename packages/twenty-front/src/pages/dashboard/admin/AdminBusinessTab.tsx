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
  StyledTable,
  StyledTh,
  StyledTd,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

type OpportunityRecord = {
  id: string;
  name?: string;
  stage?: string;
  amount?: { amountMicros: number; currencyCode: string } | null;
  closeDate?: string;
  owner?: { name: { firstName: string; lastName: string } };
};

const STAGE_ORDER = ['NEW', 'SCREENING', 'MEETING', 'PROPOSAL', 'CUSTOMER'];

const STAGE_LABELS: Record<string, string> = {
  NEW: 'New',
  SCREENING: 'Screening',
  MEETING: 'Meeting',
  PROPOSAL: 'Proposal',
  CUSTOMER: 'Customer',
};

const STAGE_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  SCREENING: '#8b5cf6',
  MEETING: '#f59e0b',
  PROPOSAL: '#10b981',
  CUSTOMER: '#06b6d4',
};

const formatCurrency = (amountMicros: number): string => {
  const amount = amountMicros / 1_000_000;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
};

const formatCurrencyFull = (amountMicros: number): string => {
  const amount = amountMicros / 1_000_000;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const AdminBusinessTab = () => {
  const { t } = useLingui();

  const {
    records: opportunities,
    loading,
    error,
  } = useFindManyRecords({
    objectNameSingular: CoreObjectNameSingular.Opportunity,
    recordGqlFields: {
      id: true,
      name: true,
      stage: true,
      amount: true,
      closeDate: true,
      owner: {
        name: { firstName: true, lastName: true },
      },
    },
  });

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (error) {
    return (
      <DashboardErrorState
        title={t`Unable to load business data`}
        description={t`There was an error loading opportunity data. Please try again.`}
      />
    );
  }

  if (opportunities.length === 0) {
    return (
      <DashboardEmptyState
        title={t`No opportunities yet`}
        description={t`Business analytics will appear here once opportunities are added.`}
      />
    );
  }

  const kpis = (() => {
    const totalPipeline = opportunities.reduce(
      (sum: number, o: any) => sum + (o.amount?.amountMicros ?? 0),
      0,
    );

    const wonOpps = opportunities.filter((o: any) => o.stage === 'CUSTOMER');
    const wonRevenue = wonOpps.reduce(
      (sum: number, o: any) => sum + (o.amount?.amountMicros ?? 0),
      0,
    );

    const winRate =
      opportunities.length > 0
        ? Math.round((wonOpps.length / opportunities.length) * 100)
        : 0;

    const avgDealSize =
      wonOpps.length > 0 ? Math.round(wonRevenue / wonOpps.length) : 0;

    return { totalPipeline, wonRevenue, winRate, avgDealSize };
  })();

  const stageBreakdown = (() => {
    const counts: Record<string, number> = {};
    const values: Record<string, number> = {};
    for (const stage of STAGE_ORDER) {
      counts[stage] = 0;
      values[stage] = 0;
    }
    for (const opp of opportunities) {
      const stage = (opp as any).stage ?? 'NEW';
      if (!counts[stage]) {
        counts[stage] = 0;
        values[stage] = 0;
      }
      counts[stage]++;
      values[stage] += (opp as any).amount?.amountMicros ?? 0;
    }
    return { counts, values };
  })();

  const maxStageValue = Math.max(...Object.values(stageBreakdown.values), 1);

  const topOpportunities = [...opportunities]
    .sort(
      (a: any, b: any) =>
        (b.amount?.amountMicros ?? 0) - (a.amount?.amountMicros ?? 0),
    )
    .slice(0, 5);

  return (
    <>
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Pipeline Value`}</StyledKpiLabel>
          <StyledKpiValue>{formatCurrency(kpis.totalPipeline)}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Won Revenue`}</StyledKpiLabel>
          <StyledKpiValue>{formatCurrency(kpis.wonRevenue)}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Win Rate`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.winRate}%</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Avg Deal Size`}</StyledKpiLabel>
          <StyledKpiValue>{formatCurrency(kpis.avgDealSize)}</StyledKpiValue>
        </StyledKpiCard>
      </StyledKpiGrid>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Opportunity Pipeline`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {STAGE_ORDER.map((stage) => (
              <StyledBarRow key={stage}>
                <StyledBarLabel>{STAGE_LABELS[stage] ?? stage}</StyledBarLabel>
                <StyledBarTrack>
                  <StyledBarFill
                    width={
                      maxStageValue > 0
                        ? (stageBreakdown.values[stage] / maxStageValue) * 100
                        : 0
                    }
                    color={STAGE_COLORS[stage]}
                  />
                </StyledBarTrack>
                <StyledBarValue>
                  {formatCurrency(stageBreakdown.values[stage])}
                </StyledBarValue>
              </StyledBarRow>
            ))}
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Stage Distribution`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {STAGE_ORDER.map((stage) => (
              <StyledBarRow key={stage}>
                <StyledBarLabel>{STAGE_LABELS[stage] ?? stage}</StyledBarLabel>
                <StyledBarTrack>
                  <StyledBarFill
                    width={
                      opportunities.length > 0
                        ? (stageBreakdown.counts[stage] / opportunities.length) *
                          100
                        : 0
                    }
                    color={STAGE_COLORS[stage]}
                  />
                </StyledBarTrack>
                <StyledBarValue>{stageBreakdown.counts[stage]}</StyledBarValue>
              </StyledBarRow>
            ))}
          </div>
        </StyledCard>
      </StyledTwoColumn>

      <StyledCard>
        <StyledCardTitle>{t`Top Opportunities`}</StyledCardTitle>
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>{t`Opportunity`}</StyledTh>
              <StyledTh>{t`Value`}</StyledTh>
              <StyledTh>{t`Stage`}</StyledTh>
            </tr>
          </thead>
          <tbody>
            {topOpportunities.map((opp: any) => (
              <tr key={opp.id}>
                <StyledTd>{opp.name ?? t`Unnamed`}</StyledTd>
                <StyledTd>
                  {formatCurrencyFull(opp.amount?.amountMicros ?? 0)}
                </StyledTd>
                <StyledTd>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: STAGE_COLORS[opp.stage ?? 'NEW'],
                      }}
                    />
                    {STAGE_LABELS[opp.stage ?? 'NEW'] ?? opp.stage}
                  </span>
                </StyledTd>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </StyledCard>
    </>
  );
};
