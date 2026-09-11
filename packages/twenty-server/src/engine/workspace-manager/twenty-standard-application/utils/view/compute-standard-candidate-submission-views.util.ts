import { msg } from '@lingui/core/macro';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import { ViewType, ViewKey } from 'twenty-shared/types';

import { INDEX_VIEW_NAME } from 'src/engine/metadata-modules/view/constants/index-view-name.constant';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardCandidateSubmissionViews = (
  args: Omit<CreateStandardViewArgs<'candidateSubmission'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allSubmissions: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'allSubmissions',
        name: INDEX_VIEW_NAME,
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconTable',
      },
    }),
    byStage: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        name: i18nLabel(msg({ message: `Pipeline`, context: 'view.name' })),
        type: ViewType.KANBAN,
        key: null,
        position: 1,
        icon: 'IconLayoutKanban',
        mainGroupByFieldName: 'stage',
      },
    }),
    candidateSubmissionRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'candidateSubmissionRecordPageFields',
        name: 'Candidate Submission Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconListDetails',
      },
    }),
  };
};
