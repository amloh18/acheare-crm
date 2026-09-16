import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import {
  CoreObjectNameSingular,
  OrderByDirection,
  SidePanelPages,
} from 'twenty-shared/types';
import { PageLayoutType } from '~/generated-metadata/graphql';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { RecordIndexSkeletonLoader } from '@/object-record/record-index/components/RecordIndexSkeletonLoader';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDestroyOneRecord } from '@/object-record/hooks/useDestroyOneRecord';
import { useDuplicateDashboard } from '@/dashboards/hooks/useDuplicateDashboard';
import { useIsDashboardPageLayoutInEditMode } from '@/page-layout/hooks/useIsDashboardPageLayoutInEditMode';
import { useSetIsPageLayoutInEditMode } from '@/page-layout/hooks/useSetIsPageLayoutInEditMode';
import { useSavePageLayout } from '@/page-layout/hooks/useSavePageLayout';
import { useSavePageLayoutWidgetsData } from '@/page-layout/hooks/useSavePageLayoutWidgetsData';
import { useResetDraftPageLayoutToPersistedPageLayout } from '@/page-layout/hooks/useResetDraftPageLayoutToPersistedPageLayout';
import { useSidePanelMenu } from '@/side-panel/hooks/useSidePanelMenu';
import { useNavigatePageLayoutSidePanel } from '@/side-panel/pages/page-layout/hooks/useNavigatePageLayoutSidePanel';
import { getTabListInstanceIdFromPageLayoutAndRecord } from '@/page-layout/utils/getTabListInstanceIdFromPageLayoutAndRecord';
import { PageLayoutComponentInstanceContext } from '@/page-layout/states/contexts/PageLayoutComponentInstanceContext';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Button } from 'twenty-ui/input';
import { IconChartBar, IconPlus } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { DashboardPageHeader } from '@/dashboards/components/DashboardPageHeader';
import { DashboardViewBar } from '@/dashboards/components/DashboardViewBar';
import { DashboardContentRenderer } from '@/dashboards/components/DashboardContentRenderer';
import { DashboardCreateDialog } from '@/dashboards/components/DashboardCreateDialog';
import { DashboardRenameDialog } from '@/dashboards/components/DashboardRenameDialog';
import { type DashboardViewItem } from '@/dashboards/components/DashboardViewTab';
import { EmployeeDashboard } from '~/pages/dashboard/employee/EmployeeDashboard';
import { AdminDashboard } from '~/pages/dashboard/admin/AdminDashboard';
import { useAchareRole } from '@/achare/hooks/useAchareRole';

export const BUILTIN_EMPLOYEE_DASHBOARD_ID = '__builtin_employee_dashboard__';
export const BUILTIN_ADMIN_DASHBOARD_ID = '__builtin_admin_dashboard__';

type DashboardRecord = {
  __typename: string;
  id: string;
  title?: string;
  position?: number;
  pageLayoutId?: string;
};

const StyledEmptyContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledEmptyIcon = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.light};
  border-radius: 50%;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  height: 64px;
  justify-content: center;
  margin-bottom: ${themeCssVariables.spacing[4]};
  width: 64px;
`;

const StyledEmptyTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[2]} 0;
`;

const StyledEmptySubtitle = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0 0 ${themeCssVariables.spacing[6]} 0;
  max-width: 400px;
`;

type DashboardBuiltinLayoutProps = {
  dashboards: DashboardViewItem[];
  activeDashboard: DashboardViewItem;
  onSelectDashboard: (id: string) => void;
  onOpenCreateDialog: () => void;
  onOpenRenameDialog: (dash: DashboardViewItem) => void;
  refetchDashboards: () => Promise<unknown>;
};

const DashboardBuiltinLayout = ({
  dashboards,
  activeDashboard,
  onSelectDashboard,
  onOpenCreateDialog,
  onOpenRenameDialog,
  refetchDashboards,
}: DashboardBuiltinLayoutProps) => {
  return (
    <PageCardLayout
      header={
        <DashboardPageHeader
          isEditMode={false}
          canDelete={false}
          onOpenCreateDialog={onOpenCreateDialog}
          onEnterEditMode={() => {}}
          onAddWidget={() => {}}
          onCancelEdit={() => {}}
          onSaveEdit={async () => {}}
          onDuplicate={() => {}}
          onDelete={() => {}}
        />
      }
      secondaryBar={
        <DashboardViewBar
          dashboards={dashboards}
          activeDashboardId={activeDashboard.id}
          isEditMode={false}
          canDelete={dashboards.length > 1}
          onSelectDashboard={onSelectDashboard}
          onOpenCreateDialog={onOpenCreateDialog}
          onOpenRenameDialog={onOpenRenameDialog}
          onDuplicated={async (newId) => {
            await refetchDashboards();
            onSelectDashboard(newId);
          }}
          onDeleted={async () => {
            await refetchDashboards();
            const remaining = dashboards.filter(
              (d) => d.id !== activeDashboard.id,
            );
            if (remaining.length > 0) {
              onSelectDashboard(remaining[0].id);
            }
          }}
          onEnterEditMode={() => {}}
          onAddWidget={() => {}}
          onDuplicate={() => {}}
          onDelete={() => {}}
        />
      }
    >
      {activeDashboard.id === BUILTIN_ADMIN_DASHBOARD_ID ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </PageCardLayout>
  );
};

type DashboardActiveLayoutProps = {
  dashboards: DashboardViewItem[];
  activeDashboard: DashboardViewItem;
  pageLayoutId: string;
  onSelectDashboard: (id: string) => void;
  onOpenCreateDialog: () => void;
  onOpenRenameDialog: (dash: DashboardViewItem) => void;
  refetchDashboards: () => Promise<unknown>;
};

const DashboardActiveLayout = ({
  dashboards,
  activeDashboard,
  pageLayoutId,
  onSelectDashboard,
  onOpenCreateDialog,
  onOpenRenameDialog,
  refetchDashboards,
}: DashboardActiveLayoutProps) => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const isEditMode = useIsDashboardPageLayoutInEditMode(pageLayoutId);
  const { setIsPageLayoutInEditMode } =
    useSetIsPageLayoutInEditMode(pageLayoutId);
  const { savePageLayout } = useSavePageLayout(pageLayoutId);
  const { savePageLayoutWidgetsData } = useSavePageLayoutWidgetsData();
  const { closeSidePanelMenu } = useSidePanelMenu();
  const { navigatePageLayoutSidePanel } = useNavigatePageLayoutSidePanel();

  const tabListInstanceId = getTabListInstanceIdFromPageLayoutAndRecord({
    pageLayoutId,
    layoutType: PageLayoutType.DASHBOARD,
    targetRecordIdentifier: {
      id: activeDashboard.id,
      targetObjectNameSingular: CoreObjectNameSingular.Dashboard,
    },
  });

  const { resetDraftPageLayoutToPersistedPageLayout } =
    useResetDraftPageLayoutToPersistedPageLayout({
      pageLayoutId,
      tabListInstanceId,
    });

  const { destroyOneRecord } = useDestroyOneRecord({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
  });

  const { duplicateDashboard } = useDuplicateDashboard();

  const handleSelectDashboardWithCleanup = (id: string) => {
    if (isEditMode) {
      setIsPageLayoutInEditMode(false);
      closeSidePanelMenu();
    }
    onSelectDashboard(id);
  };

  const handleEnterEditMode = () => {
    setIsPageLayoutInEditMode(true);
  };

  const handleAddWidget = () => {
    setIsPageLayoutInEditMode(true);
    navigatePageLayoutSidePanel({
      sidePanelPage: SidePanelPages.PageLayoutDashboardWidgetTypeSelect,
      resetNavigationStack: true,
    });
  };

  const handleCancelEdit = () => {
    closeSidePanelMenu();
    resetDraftPageLayoutToPersistedPageLayout();
    setIsPageLayoutInEditMode(false);
  };

  const handleSaveEdit = async () => {
    try {
      const result = await savePageLayout();
      if (result.status === 'successful') {
        await savePageLayoutWidgetsData(pageLayoutId);
        closeSidePanelMenu();
        setIsPageLayoutInEditMode(false);
        enqueueSuccessSnackBar({ message: t`Dashboard layout saved` });
      }
    } catch {
      enqueueErrorSnackBar({ message: t`Failed to save dashboard layout` });
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicated = await duplicateDashboard(activeDashboard.id);
      if (duplicated) {
        enqueueSuccessSnackBar({ message: t`Dashboard duplicated` });
        await refetchDashboards();
        handleSelectDashboardWithCleanup(duplicated.id);
      }
    } catch {
      enqueueErrorSnackBar({ message: t`Failed to duplicate dashboard` });
    }
  };

  const handleDelete = async () => {
    if (dashboards.length <= 1) return;
    try {
      await destroyOneRecord(activeDashboard.id);
      enqueueSuccessSnackBar({ message: t`Dashboard deleted` });
      await refetchDashboards();
      const remaining = dashboards.filter((d) => d.id !== activeDashboard.id);
      if (remaining.length > 0) {
        handleSelectDashboardWithCleanup(remaining[0].id);
      }
    } catch {
      enqueueErrorSnackBar({ message: t`Failed to delete dashboard` });
    }
  };

  return (
    <PageLayoutComponentInstanceContext.Provider
      value={{ instanceId: pageLayoutId }}
    >
      <PageCardLayout
        header={
          <DashboardPageHeader
            isEditMode={isEditMode}
            canDelete={dashboards.length > 1}
            onOpenCreateDialog={onOpenCreateDialog}
            onEnterEditMode={handleEnterEditMode}
            onAddWidget={handleAddWidget}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        }
        secondaryBar={
          <DashboardViewBar
            dashboards={dashboards}
            activeDashboardId={activeDashboard.id}
            isEditMode={isEditMode}
            canDelete={dashboards.length > 1}
            onSelectDashboard={handleSelectDashboardWithCleanup}
            onOpenCreateDialog={onOpenCreateDialog}
            onOpenRenameDialog={onOpenRenameDialog}
            onDuplicated={async (newId) => {
              await refetchDashboards();
              handleSelectDashboardWithCleanup(newId);
            }}
            onDeleted={async () => {
              await refetchDashboards();
              const remaining = dashboards.filter(
                (d) => d.id !== activeDashboard.id,
              );
              if (remaining.length > 0) {
                handleSelectDashboardWithCleanup(remaining[0].id);
              }
            }}
            onEnterEditMode={handleEnterEditMode}
            onAddWidget={handleAddWidget}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        }
      >
        <DashboardContentRenderer
          key={activeDashboard.id}
          activeDashboard={activeDashboard}
        />
      </PageCardLayout>
    </PageLayoutComponentInstanceContext.Provider>
  );
};

export const DashboardPage = () => {
  const { t } = useLingui();
  const [searchParams, setSearchParams] = useSearchParams();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { role } = useAchareRole();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DashboardViewItem | null>(
    null,
  );

  const {
    records: rawDashboards,
    loading,
    error,
    refetch,
  } = useFindManyRecords<DashboardRecord>({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
    recordGqlFields: {
      __typename: true,
      id: true,
      title: true,
      position: true,
      pageLayoutId: true,
    },
    orderBy: [{ position: OrderByDirection.AscNullsLast }],
  });

  const { createOneRecord } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
  });

  const builtinEmployeeDashboard: DashboardViewItem = useMemo(
    () => ({
      id: BUILTIN_EMPLOYEE_DASHBOARD_ID,
      title: t`My Dashboard`,
    }),
    [t],
  );

  const builtinAdminDashboard: DashboardViewItem = useMemo(
    () => ({
      id: BUILTIN_ADMIN_DASHBOARD_ID,
      title: t`Admin Dashboard`,
    }),
    [t],
  );

  const dbDashboards: DashboardViewItem[] = useMemo(
    () =>
      rawDashboards.map((dash) => ({
        id: dash.id,
        title: dash.title || t`Untitled Dashboard`,
        pageLayoutId: dash.pageLayoutId,
      })),
    [rawDashboards, t],
  );

  const dashboards: DashboardViewItem[] = useMemo(() => {
    const builtins: DashboardViewItem[] = [];
    if (role === 'admin') {
      builtins.push(builtinAdminDashboard);
    }
    builtins.push(builtinEmployeeDashboard);
    return [...builtins, ...dbDashboards];
  }, [role, builtinAdminDashboard, builtinEmployeeDashboard, dbDashboards]);

  const urlViewId = searchParams.get('viewId');

  const defaultDashboard = useMemo(() => {
    if (role === 'admin') {
      return builtinAdminDashboard;
    }
    return builtinEmployeeDashboard;
  }, [role, builtinAdminDashboard, builtinEmployeeDashboard]);

  const activeDashboard = useMemo(() => {
    if (urlViewId) {
      const match = dashboards.find((d) => d.id === urlViewId);
      if (match) {
        return match;
      }
    }
    return defaultDashboard;
  }, [dashboards, urlViewId, defaultDashboard]);

  const handleSelectDashboard = (id: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('viewId', id);
        return next;
      },
      { replace: true },
    );
  };

  const handleCreateDefault = async () => {
    try {
      const res = await createOneRecord({
        title: 'Overview',
      });
      if (res) {
        enqueueSuccessSnackBar({ message: t`Created Overview dashboard` });
        await refetch?.();
        handleSelectDashboard(res.id);
      }
    } catch {
      enqueueErrorSnackBar({ message: t`Failed to create dashboard` });
    }
  };

  const hasLoaded = !loading || dbDashboards.length > 0;

  const isBuiltinDashboard =
    activeDashboard.id === BUILTIN_EMPLOYEE_DASHBOARD_ID ||
    activeDashboard.id === BUILTIN_ADMIN_DASHBOARD_ID;

  const activeDashboardHasPageLayout =
    !isBuiltinDashboard && (activeDashboard as DashboardViewItem).pageLayoutId;

  return (
    <PageContainer>
      {!hasLoaded ? (
        <RecordIndexSkeletonLoader />
      ) : error ? (
        <PageCardLayout
          header={
            <DashboardPageHeader
              isEditMode={false}
              canDelete={false}
              onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
              onEnterEditMode={() => {}}
              onAddWidget={() => {}}
              onCancelEdit={() => {}}
              onSaveEdit={async () => {}}
              onDuplicate={() => {}}
              onDelete={() => {}}
            />
          }
        >
          <StyledEmptyContainer>
            <StyledEmptyIcon>
              <IconChartBar size={36} />
            </StyledEmptyIcon>
            <StyledEmptyTitle>{t`Unable to load dashboards`}</StyledEmptyTitle>
            <StyledEmptySubtitle>
              {t`There was an error loading your dashboards. Please try again.`}
            </StyledEmptySubtitle>
          </StyledEmptyContainer>
        </PageCardLayout>
      ) : isBuiltinDashboard ? (
        <DashboardBuiltinLayout
          key={activeDashboard.id}
          dashboards={dashboards}
          activeDashboard={activeDashboard}
          onSelectDashboard={handleSelectDashboard}
          onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
          onOpenRenameDialog={(dash) => setRenameTarget(dash)}
          refetchDashboards={async () => {
            await refetch?.();
          }}
        />
      ) : activeDashboardHasPageLayout ? (
        <DashboardActiveLayout
          key={activeDashboard.id}
          dashboards={dashboards}
          activeDashboard={activeDashboard}
          pageLayoutId={
            (activeDashboard as DashboardViewItem).pageLayoutId as string
          }
          onSelectDashboard={handleSelectDashboard}
          onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
          onOpenRenameDialog={(dash) => setRenameTarget(dash)}
          refetchDashboards={async () => {
            await refetch?.();
          }}
        />
      ) : (
        <PageCardLayout
          header={
            <DashboardPageHeader
              isEditMode={false}
              canDelete={false}
              onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
              onEnterEditMode={() => {}}
              onAddWidget={() => {}}
              onCancelEdit={() => {}}
              onSaveEdit={async () => {}}
              onDuplicate={() => {}}
              onDelete={() => {}}
            />
          }
        >
          <StyledEmptyContainer>
            <StyledEmptyIcon>
              <IconChartBar size={36} />
            </StyledEmptyIcon>
            <StyledEmptyTitle>{t`No Dashboards Yet`}</StyledEmptyTitle>
            <StyledEmptySubtitle>
              {t`Create your first dashboard view to start adding widgets and visualizing your data.`}
            </StyledEmptySubtitle>
            <Button
              variant="primary"
              Icon={IconPlus}
              title={t`Create Dashboard`}
              onClick={handleCreateDefault}
            />
          </StyledEmptyContainer>
        </PageCardLayout>
      )}

      <DashboardCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreated={async (newDash) => {
          await refetch?.();
          handleSelectDashboard(newDash.id);
        }}
      />

      {renameTarget && (
        <DashboardRenameDialog
          isOpen={true}
          dashboardId={renameTarget.id}
          initialTitle={renameTarget.title}
          onClose={() => setRenameTarget(null)}
          onRenamed={async () => {
            await refetch?.();
          }}
        />
      )}
    </PageContainer>
  );
};
