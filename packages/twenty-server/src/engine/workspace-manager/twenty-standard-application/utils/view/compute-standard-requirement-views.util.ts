import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { INDEX_VIEW_NAME } from 'src/engine/metadata-modules/view/constants/index-view-name.constant';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardRequirementViews = (
  args: Omit<CreateStandardViewArgs<'requirement'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allRequirements: createStandardViewFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'allRequirements',
        name: INDEX_VIEW_NAME,
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconTable',
      },
    }),
    byStatus: createStandardViewFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'byStatus',
        name: i18nLabel(msg({ message: `By Status`, context: 'view.name' })),
        type: ViewType.KANBAN,
        key: null,
        position: 1,
        icon: 'IconLayoutKanban',
        mainGroupByFieldName: 'status',
      },
    }),
    requirementRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'requirement',
      context: {
        viewName: 'requirementRecordPageFields',
        name: 'Requirement Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconListDetails',
      },
    }),
  };
};
