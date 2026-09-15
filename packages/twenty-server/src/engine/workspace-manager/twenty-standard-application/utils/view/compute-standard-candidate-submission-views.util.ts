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
    byStage: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        name: i18nLabel(
          msg({ message: `Recruitment Pipeline`, context: 'view.name' }),
        ),
        type: ViewType.KANBAN,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconLayoutKanban',
        mainGroupByFieldName: 'stage',
      },
    }),
    allSubmissions: createStandardViewFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'allSubmissions',
        name: i18nLabel(
          msg({ message: `All Applications`, context: 'view.name' }),
        ),
        type: ViewType.TABLE,
        key: null,
        position: 1,
        icon: 'IconTable',
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
