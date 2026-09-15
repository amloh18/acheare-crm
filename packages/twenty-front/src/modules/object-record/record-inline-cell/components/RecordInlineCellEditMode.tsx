import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { recordFieldInputIsFieldInErrorComponentState } from '@/object-record/record-field/ui/states/recordFieldInputIsFieldInErrorComponentState';
import { recordFieldInputLayoutDirectionComponentState } from '@/object-record/record-field/ui/states/recordFieldInputLayoutDirectionComponentState';
import { recordFieldInputLayoutDirectionLoadingComponentState } from '@/object-record/record-field/ui/states/recordFieldInputLayoutDirectionLoadingComponentState';
import { isFieldDate } from '@/object-record/record-field/ui/types/guards/isFieldDate';
import { isFieldDateTime } from '@/object-record/record-field/ui/types/guards/isFieldDateTime';
import { isFieldEmails } from '@/object-record/record-field/ui/types/guards/isFieldEmails';
import { isFieldLinks } from '@/object-record/record-field/ui/types/guards/isFieldLinks';
import { isFieldMorphRelationManyToOne } from '@/object-record/record-field/ui/types/guards/isFieldMorphRelationManyToOne';
import { isFieldMorphRelationOneToMany } from '@/object-record/record-field/ui/types/guards/isFieldMorphRelationOneToMany';
import { isFieldMultiSelect } from '@/object-record/record-field/ui/types/guards/isFieldMultiSelect';
import { isFieldPhones } from '@/object-record/record-field/ui/types/guards/isFieldPhones';
import { isFieldRelationManyToOne } from '@/object-record/record-field/ui/types/guards/isFieldRelationManyToOne';
import { isFieldRelationOneToMany } from '@/object-record/record-field/ui/types/guards/isFieldRelationOneToMany';
import { isFieldSelect } from '@/object-record/record-field/ui/types/guards/isFieldSelect';
import { RecordInlineCellContext } from '@/object-record/record-inline-cell/components/RecordInlineCellContext';
import { OverlayContainer } from '@/ui/layout/overlay/components/OverlayContainer';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { styled } from '@linaria/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type MiddlewareState,
} from '@floating-ui/react';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledInlineCellEditModeContainer = styled.div<{
  hasDangerBorder?: boolean;
}>`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid
    ${({ hasDangerBorder }) =>
      themeCssVariables.border.color[hasDangerBorder ? 'danger' : 'medium']};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-shadow: ${themeCssVariables.boxShadow.underline};
  box-sizing: border-box;
  display: flex;
  min-height: 24px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  > div {
    min-height: 24px;
    width: 100%;
  }

  textarea,
  input {
    line-height: 20px;
  }
`;

const StyledInlineCellOptionsReference = styled.div<{
  hasDangerBorder?: boolean;
}>`
  align-items: center;
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  display: flex;
  height: 24px;
  outline: 1px solid
    ${({ hasDangerBorder }) =>
      themeCssVariables.border.color[hasDangerBorder ? 'danger' : 'medium']};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
`;

type RecordInlineCellEditModeProps = {
  children: React.ReactNode;
};

const isFieldWithOptions = (fieldDefinition: any): boolean => {
  if (!fieldDefinition) return false;
  return (
    isFieldSelect(fieldDefinition) ||
    isFieldMultiSelect(fieldDefinition) ||
    isFieldRelationManyToOne(fieldDefinition) ||
    isFieldRelationOneToMany(fieldDefinition) ||
    isFieldMorphRelationManyToOne(fieldDefinition) ||
    isFieldMorphRelationOneToMany(fieldDefinition) ||
    isFieldDate(fieldDefinition) ||
    isFieldDateTime(fieldDefinition) ||
    isFieldLinks(fieldDefinition) ||
    isFieldEmails(fieldDefinition) ||
    isFieldPhones(fieldDefinition)
  );
};

export const RecordInlineCellEditMode = ({
  children,
}: RecordInlineCellEditModeProps) => {
  const { isCentered } = useContext(RecordInlineCellContext);
  const { fieldDefinition } = useContext(FieldContext);

  const recordFieldComponentInstanceId = useAvailableComponentInstanceIdOrThrow(
    RecordFieldComponentInstanceContext,
  );

  const setRecordFieldInputLayoutDirection = useSetAtomComponentState(
    recordFieldInputLayoutDirectionComponentState,
    recordFieldComponentInstanceId,
  );

  const setRecordFieldInputLayoutDirectionLoading = useSetAtomComponentState(
    recordFieldInputLayoutDirectionLoadingComponentState,
    recordFieldComponentInstanceId,
  );

  const setFieldInputLayoutDirectionMiddleware = {
    name: 'middleware',
    fn: async (state: MiddlewareState) => {
      setRecordFieldInputLayoutDirection(
        state.placement.startsWith('bottom') ? 'downward' : 'upward',
      );
      setRecordFieldInputLayoutDirectionLoading(false);
      return {};
    },
  };

  const recordFieldInputIsFieldInError = useAtomComponentStateValue(
    recordFieldInputIsFieldInErrorComponentState,
  );

  const hasOptions = isFieldWithOptions(fieldDefinition);

  const { refs, floatingStyles } = useFloating({
    placement: isCentered ? 'bottom' : 'bottom-start',
    middleware: [
      flip({
        fallbackStrategy: 'bestFit',
        padding: 8,
      }),
      offset({
        mainAxis: 4,
        crossAxis: 0,
      }),
      shift({ padding: 8 }),
      setFieldInputLayoutDirectionMiddleware,
    ],
    whileElementsMounted: autoUpdate,
  });

  if (!hasOptions) {
    return (
      <StyledInlineCellEditModeContainer
        data-testid="inline-cell-edit-mode-container"
        hasDangerBorder={recordFieldInputIsFieldInError}
      >
        {children}
      </StyledInlineCellEditModeContainer>
    );
  }

  return (
    <StyledInlineCellOptionsReference
      ref={refs.setReference}
      data-testid="inline-cell-edit-mode-container"
      hasDangerBorder={recordFieldInputIsFieldInError}
    >
      {createPortal(
        <OverlayContainer
          ref={refs.setFloating}
          style={floatingStyles}
          borderRadius="sm"
          hasDangerBorder={recordFieldInputIsFieldInError}
        >
          {children}
        </OverlayContainer>,
        document.body,
      )}
    </StyledInlineCellOptionsReference>
  );
};
