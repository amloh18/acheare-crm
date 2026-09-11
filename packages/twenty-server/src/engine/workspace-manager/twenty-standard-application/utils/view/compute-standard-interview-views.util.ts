import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { INDEX_VIEW_NAME } from 'src/engine/metadata-modules/view/constants/index-view-name.constant';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardInterviewViews = (
  args: Omit<CreateStandardViewArgs<'interview'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allInterviews: createStandardViewFlatMetadata({
      ...args,
      objectName: 'interview',
      context: {
        viewName: 'allInterviews',
        name: INDEX_VIEW_NAME,
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconTable',
        calendarFieldName: 'scheduledAt',
      },
    }),
    byScheduledAt: createStandardViewFlatMetadata({
      ...args,
      objectName: 'interview',
      context: {
        viewName: 'byScheduledAt',
        name: i18nLabel(msg({ message: `Calendar`, context: 'view.name' })),
        type: ViewType.CALENDAR,
        key: null,
        position: 1,
        icon: 'IconCalendar',
        calendarFieldName: 'scheduledAt',
      },
    }),
    interviewRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'interview',
      context: {
        viewName: 'interviewRecordPageFields',
        name: 'Interview Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconListDetails',
      },
    }),
  };
};
