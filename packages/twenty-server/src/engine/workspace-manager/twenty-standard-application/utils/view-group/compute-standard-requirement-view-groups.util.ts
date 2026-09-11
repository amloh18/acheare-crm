import { type FlatViewGroup } from 'src/engine/metadata-modules/flat-view-group/types/flat-view-group.type';
import {
  createStandardViewGroupFlatMetadata,
  type CreateStandardViewGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-group/create-standard-view-group-flat-metadata.util';

export const computeStandardRequirementViewGroups = (
  args: Omit<CreateStandardViewGroupArgs<'requirement'>, 'context'>,
): Record<string, FlatViewGroup> => {
  return {
    byStatusDraft: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'draft',
        isVisible: true,
        fieldValue: 'DRAFT',
        position: 0,
      },
    }),
    byStatusReceived: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'received',
        isVisible: true,
        fieldValue: 'RECEIVED',
        position: 1,
      },
    }),
    byStatusConfirmed: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'confirmed',
        isVisible: true,
        fieldValue: 'CONFIRMED',
        position: 2,
      },
    }),
    byStatusCommercialAgreed: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'commercialAgreed',
        isVisible: true,
        fieldValue: 'COMMERCIAL_AGREED',
        position: 3,
      },
    }),
    byStatusAssignedToHr: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'assignedToHr',
        isVisible: true,
        fieldValue: 'ASSIGNED_TO_HR',
        position: 4,
      },
    }),
    byStatusInProgress: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'inProgress',
        isVisible: true,
        fieldValue: 'IN_PROGRESS',
        position: 5,
      },
    }),
    byStatusPartiallyFilled: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'partiallyFilled',
        isVisible: true,
        fieldValue: 'PARTIALLY_FILLED',
        position: 6,
      },
    }),
    byStatusFilled: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'filled',
        isVisible: true,
        fieldValue: 'FILLED',
        position: 7,
      },
    }),
    byStatusClosed: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'closed',
        isVisible: true,
        fieldValue: 'CLOSED',
        position: 8,
      },
    }),
    byStatusCancelled: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        viewGroupName: 'cancelled',
        isVisible: true,
        fieldValue: 'CANCELLED',
        position: 9,
      },
    }),
  };
};
