import { RecordChip } from '@/object-record/components/RecordChip';
import { getLinkToShowPage } from '@/object-metadata/utils/getLinkToShowPage';
import { StopPropagationContainer } from '@/object-record/record-board/record-board-card/components/StopPropagationContainer';
import { visibleRecordFieldsComponentSelector } from '@/object-record/record-field/states/visibleRecordFieldsComponentSelector';
import { isFieldValueEmpty } from '@/object-record/record-field/ui/utils/isFieldValueEmpty';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useOpenRecordFromIndexView } from '@/object-record/record-index/hooks/useOpenRecordFromIndexView';
import { RecordListRowField } from '@/object-record/record-list/components/RecordListRowField';
import { useRecordListContextOrThrow } from '@/object-record/record-list/contexts/RecordListContext';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { ChipVariant } from 'twenty-ui/data-display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
  transition:
    background 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
    box-shadow: ${themeCssVariables.boxShadow.light};
  }

  &:active {
    background: ${themeCssVariables.accent.quaternary};
  }
`;

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  min-width: 0;
`;

const StyledFieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledFieldRow = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  min-height: 24px;
  overflow: hidden;
`;

const CARD_MAX_VISIBLE_FIELDS = 5;

type RecordCardItemProps = {
  recordId: string;
};

export const RecordCardItem = ({ recordId }: RecordCardItemProps) => {
  const { objectNameSingular } = useRecordListContextOrThrow();
  const {
    labelIdentifierFieldMetadataItem,
    fieldDefinitionByFieldMetadataItemId,
  } = useRecordIndexContextOrThrow();

  const recordStore = useAtomFamilyStateValue(recordStoreFamilyState, recordId);

  const visibleRecordFields = useAtomComponentSelectorValue(
    visibleRecordFieldsComponentSelector,
  );

  const { openRecordFromIndexView } = useOpenRecordFromIndexView();

  if (!isDefined(recordStore)) {
    return null;
  }

  const visibleRecordFieldsExceptLabelIdentifier = visibleRecordFields.filter(
    (recordField) =>
      recordField.fieldMetadataItemId !== labelIdentifierFieldMetadataItem?.id,
  );

  const nonEmptyRecordFields = visibleRecordFieldsExceptLabelIdentifier.flatMap(
    (recordField) => {
      const fieldDefinition =
        fieldDefinitionByFieldMetadataItemId[recordField.fieldMetadataItemId];

      if (
        !isDefined(fieldDefinition) ||
        isFieldValueEmpty({
          fieldDefinition,
          fieldValue: recordStore[fieldDefinition.metadata.fieldName],
        })
      ) {
        return [];
      }

      return [{ recordField, fieldDefinition }];
    },
  );

  const displayedRecordFields = nonEmptyRecordFields.slice(
    0,
    CARD_MAX_VISIBLE_FIELDS,
  );

  const openRecord = () => openRecordFromIndexView({ recordId });

  const linkToRecord = getLinkToShowPage(objectNameSingular, recordStore);

  return (
    <StyledCard
      role="button"
      tabIndex={0}
      aria-label={t`Open record`}
      onClick={openRecord}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openRecord();
        }
      }}
    >
      <StyledCardHeader>
        <StopPropagationContainer>
          <RecordChip
            objectNameSingular={objectNameSingular}
            record={recordStore}
            to={linkToRecord}
            variant={ChipVariant.Transparent}
            isBold
            onClick={openRecord}
            triggerEvent={'CLICK'}
          />
        </StopPropagationContainer>
      </StyledCardHeader>
      {displayedRecordFields.length > 0 && (
        <StyledFieldsList>
          {displayedRecordFields.map(({ recordField, fieldDefinition }) => (
            <StyledFieldRow key={recordField.fieldMetadataItemId}>
              <RecordListRowField
                recordId={recordId}
                recordField={recordField}
                fieldDefinition={fieldDefinition}
                maxWidth={220}
              />
            </StyledFieldRow>
          ))}
        </StyledFieldsList>
      )}
    </StyledCard>
  );
};
