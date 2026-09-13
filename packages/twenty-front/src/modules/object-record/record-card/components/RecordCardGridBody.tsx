import { RecordCardItem } from '@/object-record/record-card/components/RecordCardItem';
import { RecordListUpsertRecordsInStoreEffect } from '@/object-record/record-list/components/RecordListUpsertRecordsInStoreEffect';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { styled } from '@linaria/react';
import { useInView } from 'react-intersection-observer';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const StyledFetchMoreTrigger = styled.div`
  height: 0;
`;

type RecordCardGridBodyProps = {
  records: ObjectRecord[];
  loading: boolean;
  error?: Error;
  hasNextPage: boolean;
  fetchMoreRecords: () => void;
};

export const RecordCardGridBody = ({
  records,
  loading,
  error,
  hasNextPage,
  fetchMoreRecords,
}: RecordCardGridBodyProps) => {
  const { ref: fetchMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !loading) {
        fetchMoreRecords();
      }
    },
  });

  return (
    <>
      <RecordListUpsertRecordsInStoreEffect records={records} />
      {!isDefined(error) && (
        <>
          <StyledGrid>
            {records.map((record) => (
              <RecordCardItem key={record.id} recordId={record.id} />
            ))}
          </StyledGrid>
          {hasNextPage && !loading && (
            <StyledFetchMoreTrigger ref={fetchMoreRef} />
          )}
        </>
      )}
    </>
  );
};
