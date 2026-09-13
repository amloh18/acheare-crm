import { useRecordIndexTableQuery } from '@/object-record/record-index/hooks/useRecordIndexTableQuery';
import { RecordCardGridBody } from '@/object-record/record-card/components/RecordCardGridBody';
import { RecordListEmptyState } from '@/object-record/record-list/components/RecordListEmptyState';
import { RecordListComponentInstanceContext } from '@/object-record/record-list/states/contexts/RecordListComponentInstanceContext';
import { useRecordListContextOrThrow } from '@/object-record/record-list/contexts/RecordListContext';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { styled } from '@linaria/react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${themeCssVariables.spacing[2]};
  padding-left: ${themeCssVariables.spacing[1]};
`;

export const RecordCardGrid = () => {
  const recordListId = useAvailableComponentInstanceIdOrThrow(
    RecordListComponentInstanceContext,
  );

  const { objectNameSingular } = useRecordListContextOrThrow();

  const { records, loading, error, hasNextPage, fetchMoreRecords } =
    useRecordIndexTableQuery(objectNameSingular);

  const isEmpty = !loading && !isDefined(error) && records.length === 0;

  if (isEmpty) {
    return <RecordListEmptyState />;
  }

  return (
    <StyledContainer>
      <ScrollWrapper
        componentInstanceId={`scroll-wrapper-record-card-${recordListId}`}
        defaultEnableXScroll={false}
      >
        <RecordCardGridBody
          records={records}
          loading={loading}
          error={error}
          hasNextPage={hasNextPage}
          fetchMoreRecords={fetchMoreRecords}
        />
      </ScrollWrapper>
    </StyledContainer>
  );
};
