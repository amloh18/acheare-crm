import { type FlatViewGroup } from 'src/engine/metadata-modules/flat-view-group/types/flat-view-group.type';
import {
  createStandardViewGroupFlatMetadata,
  type CreateStandardViewGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-group/create-standard-view-group-flat-metadata.util';

export const computeStandardCandidateSubmissionViewGroups = (
  args: Omit<CreateStandardViewGroupArgs<'candidateSubmission'>, 'context'>,
): Record<string, FlatViewGroup> => {
  return {
    byStageSourced: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'sourced',
        isVisible: true,
        fieldValue: 'SOURCED',
        position: 0,
      },
    }),
    byStageScreening: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'screening',
        isVisible: true,
        fieldValue: 'SCREENING',
        position: 1,
      },
    }),
    byStageShortlisted: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'shortlisted',
        isVisible: true,
        fieldValue: 'SHORTLISTED',
        position: 2,
      },
    }),
    byStageSubmittedToClient: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'submittedToClient',
        isVisible: true,
        fieldValue: 'SUBMITTED_TO_CLIENT',
        position: 3,
      },
    }),
    byStageClientReview: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'clientReview',
        isVisible: true,
        fieldValue: 'CLIENT_REVIEW',
        position: 4,
      },
    }),
    byStageInterview: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'interview',
        isVisible: true,
        fieldValue: 'INTERVIEW',
        position: 5,
      },
    }),
    byStageSelected: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'selected',
        isVisible: true,
        fieldValue: 'SELECTED',
        position: 6,
      },
    }),
    byStageOffer: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'offer',
        isVisible: true,
        fieldValue: 'OFFER',
        position: 7,
      },
    }),
    byStageOfferAccepted: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'offerAccepted',
        isVisible: true,
        fieldValue: 'OFFER_ACCEPTED',
        position: 8,
      },
    }),
    byStageJoined: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'joined',
        isVisible: true,
        fieldValue: 'JOINED',
        position: 9,
      },
    }),
    byStageRejected: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'rejected',
        isVisible: true,
        fieldValue: 'REJECTED',
        position: 10,
      },
    }),
    byStageDropped: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'candidateSubmission',
      context: {
        viewName: 'byStage',
        viewGroupName: 'dropped',
        isVisible: true,
        fieldValue: 'DROPPED',
        position: 11,
      },
    }),
  };
};
