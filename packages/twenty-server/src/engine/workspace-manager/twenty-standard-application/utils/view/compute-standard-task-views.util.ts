import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { INDEX_VIEW_NAME } from 'src/engine/metadata-modules/view/constants/index-view-name.constant';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardTaskViews = (
  args: Omit<CreateStandardViewArgs<'task'>, 'context'>,
): Record<string, FlatView> => {
  return {
    byStatus: createStandardViewFlatMetadata({
      ...args,
      objectName: 'task',
      context: {
        viewName: 'byStatus',
        name: i18nLabel(msg({ message: `My Tasks`, context: 'view.name' })),
        type: ViewType.KANBAN,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconLayoutKanban',
        mainGroupByFieldName: 'status',
      },
    }),
    allTasks: createStandardViewFlatMetadata({
      ...args,
      objectName: 'task',
      context: {
        viewName: 'allTasks',
        name: i18nLabel(msg({ message: `All Tasks`, context: 'view.name' })),
        type: ViewType.TABLE,
        key: null,
        position: 1,
        icon: 'IconTable',
      },
    }),
    assignedToMe: createStandardViewFlatMetadata({
      ...args,
      objectName: 'task',
      context: {
        viewName: 'assignedToMe',
        name: i18nLabel(
          msg({ message: `Assigned to Me`, context: 'view.name' }),
        ),
        type: ViewType.TABLE,
        key: null,
        position: 2,
        icon: 'IconUserCircle',
        mainGroupByFieldName: 'status',
      },
    }),
    taskRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'task',
      context: {
        viewName: 'taskRecordPageFields',
        name: 'Task Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconListDetails',
      },
    }),
  };
};
