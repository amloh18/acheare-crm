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
  StyledProgressBar,
  StyledProgressSegment,
  StyledProgressLegend,
  StyledLegendItem,
  StyledLegendDot,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

const PERFORMANCE_DISTRIBUTION = [
  { label: '5.0', count: 8, color: '#10b981' },
  { label: '4.5', count: 15, color: '#3b82f6' },
  { label: '4.0', count: 12, color: '#6366f1' },
  { label: '3.5', count: 6, color: '#f59e0b' },
  { label: '3.0', count: 3, color: '#ef4444' },
];

const DEPARTMENT_PERFORMANCE = [
  { dept: 'Engineering', score: 4.5 },
  { dept: 'Design', score: 4.4 },
  { dept: 'Sales', score: 4.1 },
  { dept: 'Marketing', score: 4.0 },
  { dept: 'Operations', score: 3.8 },
];

const GOALS_DATA = {
  completed: 78,
  onTrack: 14,
  atRisk: 8,
};

const PERFORMANCE_TREND = [4.1, 4.2, 4.2, 4.3, 4.3, 4.4, 4.3, 4.3];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export const AdminPerformanceTab = () => {
  const { t } = useLingui();

  const {
    records: employees,
    loading,
    error,
  } = useFindManyRecords({
    objectNameSingular: 'employee' as CoreObjectNameSingular,
    recordGqlFields: {
      id: true,
      department: { id: true, name: true },
    },
  });

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (error) {
    return (
      <DashboardErrorState
        title={t`Unable to load performance data`}
        description={t`There was an error loading performance analytics. Please try again.`}
      />
    );
  }

  if (employees.length === 0) {
    return (
      <DashboardEmptyState
        title={t`No performance data yet`}
        description={t`Performance analytics will appear here once employees are added.`}
      />
    );
  }

  const kpis = (() => {
    const totalPerf = PERFORMANCE_DISTRIBUTION.reduce(
      (sum, d) => sum + d.count * parseFloat(d.label),
      0,
    );
    const totalPeople = PERFORMANCE_DISTRIBUTION.reduce(
      (sum, d) => sum + d.count,
      0,
    );
    const avgPerf = totalPeople > 0 ? (totalPerf / totalPeople).toFixed(1) : '0.0';
    const highPerformers = PERFORMANCE_DISTRIBUTION.filter(
      (d) => parseFloat(d.label) >= 4.5,
    ).reduce((sum, d) => sum + d.count, 0);

    return {
      avgPerformance: avgPerf,
      goalsCompleted: GOALS_DATA.completed,
      highPerformers,
      totalEmployees: employees.length,
    };
  })();

  const maxDistCount = Math.max(
    ...PERFORMANCE_DISTRIBUTION.map((d) => d.count),
    1,
  );

  const maxDeptScore = Math.max(
    ...DEPARTMENT_PERFORMANCE.map((d) => d.score),
    1,
  );

  const maxTrendValue = Math.max(...PERFORMANCE_TREND, 1);

  return (
    <>
      <StyledKpiGrid>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Avg Performance`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.avgPerformance} / 5</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Goals Completed`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.goalsCompleted}%</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`High Performers`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.highPerformers}</StyledKpiValue>
        </StyledKpiCard>
        <StyledKpiCard>
          <StyledKpiLabel>{t`Total Employees`}</StyledKpiLabel>
          <StyledKpiValue>{kpis.totalEmployees}</StyledKpiValue>
        </StyledKpiCard>
      </StyledKpiGrid>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Performance Distribution`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PERFORMANCE_DISTRIBUTION.map((d) => (
              <StyledBarRow key={d.label}>
                <StyledBarLabel>{d.label}</StyledBarLabel>
                <StyledBarTrack>
                  <StyledBarFill
                    width={(d.count / maxDistCount) * 100}
                    color={d.color}
                  />
                </StyledBarTrack>
                <StyledBarValue>{d.count}</StyledBarValue>
              </StyledBarRow>
            ))}
          </div>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Department Performance`}</StyledCardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEPARTMENT_PERFORMANCE.map((d) => (
              <StyledBarRow key={d.dept}>
                <StyledBarLabel>{d.dept}</StyledBarLabel>
                <StyledBarTrack>
                  <StyledBarFill
                    width={(d.score / maxDeptScore) * 100}
                    color={
                      d.score >= 4.3
                        ? '#10b981'
                        : d.score >= 4.0
                          ? '#3b82f6'
                          : '#f59e0b'
                    }
                  />
                </StyledBarTrack>
                <StyledBarValue>{d.score}</StyledBarValue>
              </StyledBarRow>
            ))}
          </div>
        </StyledCard>
      </StyledTwoColumn>

      <StyledTwoColumn>
        <StyledCard>
          <StyledCardTitle>{t`Goals`}</StyledCardTitle>
          <StyledProgressBar>
            <StyledProgressSegment
              width={GOALS_DATA.completed}
              color="#10b981"
            />
            <StyledProgressSegment
              width={GOALS_DATA.onTrack}
              color="#3b82f6"
            />
            <StyledProgressSegment
              width={GOALS_DATA.atRisk}
              color="#f59e0b"
            />
          </StyledProgressBar>
          <StyledProgressLegend>
            <StyledLegendItem>
              <StyledLegendDot color="#10b981" />
              {t`Completed`} {GOALS_DATA.completed}%
            </StyledLegendItem>
            <StyledLegendItem>
              <StyledLegendDot color="#3b82f6" />
              {t`On Track`} {GOALS_DATA.onTrack}%
            </StyledLegendItem>
            <StyledLegendItem>
              <StyledLegendDot color="#f59e0b" />
              {t`At Risk`} {GOALS_DATA.atRisk}%
            </StyledLegendItem>
          </StyledProgressLegend>
        </StyledCard>

        <StyledCard>
          <StyledCardTitle>{t`Performance Trend`}</StyledCardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '80px',
            }}
          >
            {PERFORMANCE_TREND.map((value, idx) => (
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
                  {value}
                </span>
                <div
                  style={{
                    width: '100%',
                    height: `${(value / maxTrendValue) * 60}px`,
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
                  {MONTHS_SHORT[idx]}
                </span>
              </div>
            ))}
          </div>
        </StyledCard>
      </StyledTwoColumn>
    </>
  );
};
