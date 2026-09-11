import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { assertUnreachable } from 'twenty-shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum WorkspaceFeatureExceptionCode {
  FEATURE_HAS_DEPENDENTS = 'FEATURE_HAS_DEPENDENTS',
  INVALID_FEATURE_KEY = 'INVALID_FEATURE_KEY',
}

const getWorkspaceFeatureExceptionUserFriendlyMessage = (
  code: WorkspaceFeatureExceptionCode,
) => {
  switch (code) {
    case WorkspaceFeatureExceptionCode.FEATURE_HAS_DEPENDENTS:
      return msg`Other features depend on this one. Disable them first, or turn this off along with its dependents.`;
    case WorkspaceFeatureExceptionCode.INVALID_FEATURE_KEY:
      return msg`That feature is not recognised.`;
    default:
      assertUnreachable(code);
  }
};

export class WorkspaceFeatureException extends CustomException<WorkspaceFeatureExceptionCode> {
  constructor(
    message: string,
    code: WorkspaceFeatureExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkspaceFeatureExceptionUserFriendlyMessage(code),
    });
  }
}
