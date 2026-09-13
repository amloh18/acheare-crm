import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { RecordCardGrid } from '@/object-record/record-card/components/RecordCardGrid';
import { RecordListSSESubscribeEffect } from '@/object-record/record-list/components/RecordListSSESubscribeEffect';
import { RecordListContextProvider } from '@/object-record/record-list/contexts/RecordListContext';

type RecordCardContainerProps = {
  objectNameSingular: string;
  viewBarInstanceId: string;
};

export const RecordCardContainer = ({
  objectNameSingular,
  viewBarInstanceId,
}: RecordCardContainerProps) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const objectPermissions = useObjectPermissionsForObject(
    objectMetadataItem.id,
  );

  return (
    <RecordListContextProvider
      value={{
        viewBarInstanceId,
        objectNameSingular,
        objectMetadataItem,
        objectPermissions,
      }}
    >
      <RecordCardGrid />
      <RecordListSSESubscribeEffect />
    </RecordListContextProvider>
  );
};
