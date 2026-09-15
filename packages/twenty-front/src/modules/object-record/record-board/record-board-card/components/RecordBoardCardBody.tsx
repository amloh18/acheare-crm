import { isRecordFieldReadOnly } from '@/object-record/read-only/utils/isRecordFieldReadOnly';
import { RecordBoardContext } from '@/object-record/record-board/contexts/RecordBoardContext';
import { StopPropagationContainer } from '@/object-record/record-board/record-board-card/components/StopPropagationContainer';
import { RECORD_BOARD_CARD_INPUT_ID_PREFIX } from '@/object-record/record-board/record-board-card/constants/RecordBoardCardInputIdPrefix';
import { RecordBoardCardContext } from '@/object-record/record-board/record-board-card/contexts/RecordBoardCardContext';
import { recordBoardCardHoverPositionComponentState } from '@/object-record/record-board/record-board-card/states/recordBoardCardHoverPositionComponentState';
import { getPriorityFieldsForCompactMode } from '@/object-record/record-board/record-board-card/utils/getPriorityFieldsForCompactMode';
import { RecordCardBodyContainer } from '@/object-record/record-card/components/RecordCardBodyContainer';
import { visibleRecordFieldsComponentSelector } from '@/object-record/record-field/states/visibleRecordFieldsComponentSelector';
import {
  FieldContext,
  type RecordUpdateHook,
  type RecordUpdateHookParams,
} from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { RecordInlineCell } from '@/object-record/record-inline-cell/components/RecordInlineCell';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { recordBoardCardIsExpandedComponentState } from '@/object-record/record-board/record-board-card/states/recordBoardCardIsExpandedComponentState';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledCompactCardBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[1]} 10px;
  span {
    align-items: center;
    display: flex;
    flex-direction: row;
    svg {
      color: ${themeCssVariables.font.color.tertiary};
      margin-right: ${themeCssVariables.spacing[2]};
    }
  }
`;

export const RecordBoardCardBody = () => {
  const { recordId, isRecordReadOnly, isDragOverlay } = useContext(
    RecordBoardCardContext,
  );

  const { updateOneRecord, objectPermissions } = useContext(RecordBoardContext);

  const {
    labelIdentifierFieldMetadataItem,
    fieldMetadataItemByFieldMetadataItemId,
    fieldDefinitionByFieldMetadataItemId,
    objectPermissionsByObjectMetadataId,
  } = useRecordIndexContextOrThrow();

  const useUpdateOneRecordHook: RecordUpdateHook = () => {
    const updateEntity = ({ variables }: RecordUpdateHookParams) => {
      updateOneRecord?.({
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    };

    return [updateEntity, { loading: false }];
  };

  const visibleRecordFields = useAtomComponentSelectorValue(
    visibleRecordFieldsComponentSelector,
  );

  const recordBoardCardIsExpanded = useAtomComponentStateValue(
    recordBoardCardIsExpandedComponentState,
    `record-board-card-${recordId}`,
  );

  const visibleRecordFieldsExceptLabelIdentifier = visibleRecordFields.filter(
    (recordField) =>
      recordField.fieldMetadataItemId !== labelIdentifierFieldMetadataItem?.id,
  );

  const isCollapsed = !recordBoardCardIsExpanded;

  const fieldsToShow = isCollapsed
    ? getPriorityFieldsForCompactMode(
        visibleRecordFieldsExceptLabelIdentifier,
        fieldMetadataItemByFieldMetadataItemId,
      )
    : visibleRecordFieldsExceptLabelIdentifier;

  const setRecordBoardCardHoverPosition = useSetAtomComponentState(
    recordBoardCardHoverPositionComponentState,
  );

  const handleMouseEnter = (index: number) => {
    setRecordBoardCardHoverPosition(index);
  };

  const Container = isCollapsed
    ? StyledCompactCardBodyContainer
    : RecordCardBodyContainer;

  return (
    <Container>
      {fieldsToShow.map((recordField, index) => {
        const correspondingFieldDefinition =
          fieldDefinitionByFieldMetadataItemId[recordField.fieldMetadataItemId];
        const fieldMetadataItem =
          fieldMetadataItemByFieldMetadataItemId[
            recordField.fieldMetadataItemId
          ];

        if (
          !isDefined(correspondingFieldDefinition) ||
          !isDefined(fieldMetadataItem)
        ) {
          return null;
        }

        return (
          <StopPropagationContainer key={recordField.fieldMetadataItemId}>
            <FieldContext.Provider
              value={{
                recordId,
                maxWidth: 156,
                isLabelIdentifier: false,
                isRecordFieldReadOnly: isRecordFieldReadOnly({
                  isRecordReadOnly,
                  objectPermissions,
                  fieldMetadataItem,
                  fieldDefinition: correspondingFieldDefinition,
                  objectPermissionsByObjectMetadataId,
                }),
                fieldDefinition: correspondingFieldDefinition,
                useUpdateRecord: useUpdateOneRecordHook,
                isDisplayModeFixHeight: true,
                triggerEvent: 'CLICK',
                anchorId: isDragOverlay
                  ? undefined
                  : `${RECORD_BOARD_CARD_INPUT_ID_PREFIX}-${recordId}-${correspondingFieldDefinition.metadata.fieldName}`,
                onMouseEnter: () => handleMouseEnter(index),
              }}
            >
              <RecordFieldComponentInstanceContext.Provider
                value={{
                  instanceId: getRecordFieldInputInstanceId({
                    recordId,
                    fieldName: correspondingFieldDefinition.metadata.fieldName,
                    prefix: RECORD_BOARD_CARD_INPUT_ID_PREFIX,
                  }),
                }}
              >
                <RecordInlineCell
                  instanceIdPrefix={RECORD_BOARD_CARD_INPUT_ID_PREFIX}
                />
              </RecordFieldComponentInstanceContext.Provider>
            </FieldContext.Provider>
          </StopPropagationContainer>
        );
      })}
    </Container>
  );
};
