import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAttachmentViews = (
  args: Omit<CreateStandardViewArgs<'attachment'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allAttachments: createStandardViewFlatMetadata({
      ...args,
      objectName: 'attachment',
      context: {
        viewName: 'allAttachments',
        name: i18nLabel(
          msg({ message: `All Documents`, context: 'view.name' }),
        ),
        type: ViewType.LIST,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
