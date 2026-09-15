import { useEffect } from 'react';
import { CoreObjectNameSingular, ContextStorePageType } from 'twenty-shared/types';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useRecordShowPageResource } from '@/object-record/record-show/hooks/useRecordShowPageResource';
import { RecordShowPageResourceEffect } from '@/object-record/record-show/components/RecordShowPageResourceEffect';
import { RecordShowPageSSESubscribeEffect } from '@/object-record/record-show/components/RecordShowPageSSESubscribeEffect';
import { PageLayoutRecordPageRenderer } from '@/object-record/record-show/components/PageLayoutRecordPageRenderer';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { CommandMenuComponentInstanceContext } from '@/command-menu/states/contexts/CommandMenuComponentInstanceContext';
import { TimelineActivityContext } from '@/activities/timeline-activities/contexts/TimelineActivityContext';
import { computeRecordShowComponentInstanceId } from '@/object-record/record-show/utils/computeRecordShowComponentInstanceId';
import { useWorkspaceSurfaceScopedComponentInstanceId } from '@/ui/layout/hooks/useWorkspaceSurfaceScopedComponentInstanceId';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreCurrentPageTypeComponentState } from '@/context-store/states/contextStoreCurrentPageTypeComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { type DashboardViewItem } from '@/dashboards/components/DashboardViewTab';

type DashboardContentRendererProps = {
  activeDashboard: DashboardViewItem;
};

export const DashboardContentRenderer = ({
  activeDashboard,
}: DashboardContentRendererProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
  });

  const setContextStoreCurrentObjectMetadataItemId = useSetAtomComponentState(
    contextStoreCurrentObjectMetadataItemIdComponentState,
  );
  const setContextStoreCurrentPageType = useSetAtomComponentState(
    contextStoreCurrentPageTypeComponentState,
  );
  const setContextStoreCurrentViewId = useSetAtomComponentState(
    contextStoreCurrentViewIdComponentState,
  );
  const setContextStoreTargetedRecordsRule = useSetAtomComponentState(
    contextStoreTargetedRecordsRuleComponentState,
  );
  const setContextStoreNumberOfSelectedRecords = useSetAtomComponentState(
    contextStoreNumberOfSelectedRecordsComponentState,
  );

  useEffect(() => {
    if (objectMetadataItem?.id) {
      setContextStoreCurrentObjectMetadataItemId(objectMetadataItem.id);
    }
    setContextStoreCurrentPageType(ContextStorePageType.Record);
    setContextStoreCurrentViewId(activeDashboard.id);
    setContextStoreTargetedRecordsRule({
      mode: 'selection',
      selectedRecordIds: [activeDashboard.id],
    });
    setContextStoreNumberOfSelectedRecords(1);

    return () => {
      setContextStoreTargetedRecordsRule({
        mode: 'selection',
        selectedRecordIds: [],
      });
      setContextStoreNumberOfSelectedRecords(0);
    };
  }, [
    activeDashboard.id,
    objectMetadataItem?.id,
    setContextStoreCurrentObjectMetadataItemId,
    setContextStoreCurrentPageType,
    setContextStoreCurrentViewId,
    setContextStoreTargetedRecordsRule,
    setContextStoreNumberOfSelectedRecords,
  ]);

  const { loading, record } = useRecordShowPageResource({
    objectNameSingular: CoreObjectNameSingular.Dashboard,
    recordId: activeDashboard.id,
  });

  const recordShowComponentInstanceId =
    useWorkspaceSurfaceScopedComponentInstanceId(
      computeRecordShowComponentInstanceId(activeDashboard.id),
    );

  return (
    <RecordComponentInstanceContextsWrapper
      componentInstanceId={recordShowComponentInstanceId}
    >
      <CommandMenuComponentInstanceContext.Provider
        value={{ instanceId: recordShowComponentInstanceId }}
      >
        <RecordShowPageResourceEffect
          loading={loading}
          record={record}
          recordId={activeDashboard.id}
        />
        <TimelineActivityContext.Provider
          value={{
            recordId: activeDashboard.id,
          }}
        >
          <PageLayoutRecordPageRenderer
            targetRecordIdentifier={{
              id: activeDashboard.id,
              targetObjectNameSingular: CoreObjectNameSingular.Dashboard,
            }}
          />
          <RecordShowPageSSESubscribeEffect
            objectNameSingular={CoreObjectNameSingular.Dashboard}
            recordId={activeDashboard.id}
          />
        </TimelineActivityContext.Provider>
      </CommandMenuComponentInstanceContext.Provider>
    </RecordComponentInstanceContextsWrapper>
  );
};
