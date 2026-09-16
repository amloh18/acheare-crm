import { useMemo } from 'react';
import { useLingui } from '@lingui/react/macro';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconAlertTriangle } from 'twenty-ui/icon';

import {
  StyledCard,
  StyledCardTitle,
  StyledKpiGrid,
  StyledKpiCard,
  StyledKpiLabel,
  StyledKpiValue,
} from './AdminDashboardStyles';
import {
  DashboardLoadingState,
  DashboardEmptyState,
  DashboardErrorState,
} from './DashboardStates';

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

  return (
    <DashboardEmptyState
      title={t`Performance tracking coming soon`}
      description={t`Performance reviews, goals, and ratings will be available here once the performance module is enabled.`}
    />
  );
};
