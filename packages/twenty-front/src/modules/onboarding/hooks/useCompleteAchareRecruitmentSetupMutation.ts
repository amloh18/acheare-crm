import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';

import { CompleteAchareRecruitmentSetupDocument } from '~/generated-metadata/graphql';

export const useCompleteAchareRecruitmentSetupMutation = () => {
  const [mutate, result] = useMutation(CompleteAchareRecruitmentSetupDocument);

  const completeRecruitmentSetup = useCallback(
    (options?: unknown) => mutate(options as never),
    [mutate],
  );

  return [completeRecruitmentSetup, result] as const;
};
