import { useHiddenWorkspaceWorkflowRunRelationFields } from '@/object-core/workflows/hooks/useHiddenWorkspaceWorkflowRunRelationFields';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { type WidgetVisibilityContext } from '@/page-layout/types/WidgetVisibilityContext';
import { buildWidgetVisibilityContext } from '@/page-layout/utils/buildWidgetVisibilityContext';
import { useLayoutRenderingContext } from '@/ui/layout/contexts/LayoutRenderingContext';
import { useWorkspaceSurface } from '@/ui/layout/hooks/useWorkspaceSurface';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { getDisabledAchareStandardObjectKeys } from 'twenty-shared/workspace';
import { useIsMobile } from 'twenty-ui/utilities';

import { useAchareEnabledFeatures } from '@/workspace-feature/hooks/useAchareEnabledFeatures';

// The one place widget visibility is derived. Every consumer reads the same
// context, so a widget cannot be visible to one caller and hidden from another
// — which is what makes "is this widget last in its tab" agree with "which
// widgets does this tab render".
export const useWidgetVisibilityContext = (): WidgetVisibilityContext => {
  const isMobile = useIsMobile();
  const { targetRecordIdentifier } = useLayoutRenderingContext();
  const isInSidePanel = useWorkspaceSurface().type === 'side-panel';

  const recordStore = useAtomFamilyStateValue(
    recordStoreFamilyState,
    targetRecordIdentifier?.id ?? '',
  );

  // Remove with the workspace workflow and workflowVersion objects, once the
  // core migration owns them.
  const hiddenFieldMetadataIdsOrNames =
    useHiddenWorkspaceWorkflowRunRelationFields(
      targetRecordIdentifier?.targetObjectNameSingular,
    );

  const { objectMetadataItems } = useObjectMetadataItems();
  const enabledAchareFeatures = useAchareEnabledFeatures();

  // Resolve once, here, where object metadata is available: the pure filter
  // then only has to check membership. `undefined` features mean "not loaded
  // yet", which yields no hidden objects and leaves widgets untouched.
  const hiddenObjectMetadataIdsForDisabledFeatures = useMemo(() => {
    const disabledStandardObjectKeys =
      getDisabledAchareStandardObjectKeys(enabledAchareFeatures);

    if (!isDefined(disabledStandardObjectKeys)) {
      return [];
    }

    return objectMetadataItems
      .filter((objectMetadataItem) =>
        disabledStandardObjectKeys.includes(objectMetadataItem.nameSingular),
      )
      .map((objectMetadataItem) => objectMetadataItem.id);
  }, [enabledAchareFeatures, objectMetadataItems]);

  return useMemo(
    () => ({
      ...buildWidgetVisibilityContext({
        isMobile,
        isInSidePanel,
        targetRecord: isDefined(recordStore) ? recordStore : undefined,
      }),
      hiddenFieldMetadataIdsOrNames,
      hiddenObjectMetadataIdsForDisabledFeatures,
    }),
    [
      isMobile,
      isInSidePanel,
      recordStore,
      hiddenFieldMetadataIdsOrNames,
      hiddenObjectMetadataIdsForDisabledFeatures,
    ],
  );
};
