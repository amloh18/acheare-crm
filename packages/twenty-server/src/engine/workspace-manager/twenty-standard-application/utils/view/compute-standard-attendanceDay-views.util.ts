import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { INDEX_VIEW_NAME } from 'src/engine/metadata-modules/view/constants/index-view-name.constant';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardAttendanceDayViews = (
  args: Omit<CreateStandardViewArgs<'attendanceDay'>, 'context'>,
): Record<string, FlatView> => {
  return {
  allAttendanceDays: createStandardViewFlatMetadata({
      ...args,
      objectName: 'attendanceDay',
      context: {
        viewName: 'allAttendanceDays',
        name: i18nLabel(msg({ message: `Attendance`, context: 'view.name' })),
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconCalendarStats',
      },
    }),
  attendanceDayRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'attendanceDay',
      context: {
        viewName: 'attendanceDayRecordPageFields',
        name: 'Attendance Day Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconListDetails',
      },
    }),
  };
};
