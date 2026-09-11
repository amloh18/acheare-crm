import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { INDEX_VIEW_NAME } from 'src/engine/metadata-modules/view/constants/index-view-name.constant';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardPaymentViews = (
  args: Omit<CreateStandardViewArgs<'payment'>, 'context'>,
): Record<string, FlatView> => {
  return {
  allPayments: createStandardViewFlatMetadata({
      ...args,
      objectName: 'payment',
      context: {
        viewName: 'allPayments',
        name: INDEX_VIEW_NAME,
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconCreditCard',
      },
    }),
  paymentRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'payment',
      context: {
        viewName: 'paymentRecordPageFields',
        name: 'Payment Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconListDetails',
      },
    }),
  };
};
