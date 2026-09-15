import { Key } from 'ts-key-enum';

import { IconPicker } from '@/ui/input/components/IconPicker';
import { Select } from '@/ui/input/components/Select';
import { TextInput } from '@/ui/input/components/TextInput';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuHeader } from '@/ui/layout/dropdown/components/DropdownMenuHeader/DropdownMenuHeader';
import { DropdownMenuHeaderLeftComponent } from '@/ui/layout/dropdown/components/DropdownMenuHeader/internal/DropdownMenuHeaderLeftComponent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { useHotkeysOnFocusedElement } from '@/ui/utilities/hotkey/hooks/useHotkeysOnFocusedElement';
import { useAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { ViewType, viewTypeIconKeyMapping } from '@/views/types/ViewType';
import { ViewPickerEditButton } from '@/views/view-picker/components/ViewPickerEditButton';
import { ViewPickerIconAndNameContainer } from '@/views/view-picker/components/ViewPickerIconAndNameContainer';
import { ViewPickerSaveButtonContainer } from '@/views/view-picker/components/ViewPickerSaveButtonContainer';
import { ViewPickerSelectContainer } from '@/views/view-picker/components/ViewPickerSelectContainer';
import { VIEW_PICKER_CALENDAR_FIELD_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerCalendarFieldDropdownId';
import { VIEW_PICKER_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerDropdownId';
import { VIEW_PICKER_KANBAN_FIELD_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerKanbanFieldDropdownId';
import { VIEW_PICKER_TYPE_SELECT_OPTIONS } from '@/views/view-picker/constants/ViewPickerTypeSelectOptions';
import { VIEW_PICKER_VIEW_TYPE_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerViewTypeDropdownId';
import { useGetAvailableFieldsForCalendar } from '@/views/view-picker/hooks/useGetAvailableFieldsForCalendar';
import { useGetAvailableFieldsToGroupRecordsBy } from '@/views/view-picker/hooks/useGetAvailableFieldsToGroupRecordsBy';
import { useViewPickerMode } from '@/views/view-picker/hooks/useViewPickerMode';
import { viewPickerCalendarFieldMetadataIdComponentState } from '@/views/view-picker/states/viewPickerCalendarFieldMetadataIdComponentState';
import { viewPickerInputNameComponentState } from '@/views/view-picker/states/viewPickerInputNameComponentState';
import { viewPickerIsDirtyComponentState } from '@/views/view-picker/states/viewPickerIsDirtyComponentState';
import { viewPickerIsPersistingComponentState } from '@/views/view-picker/states/viewPickerIsPersistingComponentState';
import { viewPickerMainGroupByFieldMetadataIdComponentState } from '@/views/view-picker/states/viewPickerMainGroupByFieldMetadataIdComponentState';
import { viewPickerSelectedIconComponentState } from '@/views/view-picker/states/viewPickerSelectedIconComponentState';
import { viewPickerTypeComponentState } from '@/views/view-picker/states/viewPickerTypeComponentState';
import { useUpdateViewFromCurrentState } from '@/views/view-picker/hooks/useUpdateViewFromCurrentState';
import { t } from '@lingui/core/macro';
import { IconChevronLeft } from 'twenty-ui/icon';

export const ViewPickerContentEditMode = () => {
  const { setViewPickerMode } = useViewPickerMode();

  const [viewPickerInputName, setViewPickerInputName] = useAtomComponentState(
    viewPickerInputNameComponentState,
  );
  const [viewPickerSelectedIcon, setViewPickerSelectedIcon] =
    useAtomComponentState(viewPickerSelectedIconComponentState);

  const [viewPickerType, setViewPickerType] = useAtomComponentState(
    viewPickerTypeComponentState,
  );

  const [
    viewPickerMainGroupByFieldMetadataId,
    setViewPickerMainGroupByFieldMetadataId,
  ] = useAtomComponentState(viewPickerMainGroupByFieldMetadataIdComponentState);

  const [
    viewPickerCalendarFieldMetadataId,
    setViewPickerCalendarFieldMetadataId,
  ] = useAtomComponentState(viewPickerCalendarFieldMetadataIdComponentState);

  const { availableFieldsForGrouping } =
    useGetAvailableFieldsToGroupRecordsBy();
  const { availableFieldsForCalendar } = useGetAvailableFieldsForCalendar();

  const viewPickerIsPersisting = useAtomComponentStateValue(
    viewPickerIsPersistingComponentState,
  );
  const setViewPickerIsDirty = useSetAtomComponentState(
    viewPickerIsDirtyComponentState,
  );

  const { updateViewFromCurrentState } = useUpdateViewFromCurrentState();

  useHotkeysOnFocusedElement({
    keys: [Key.Enter],
    callback: async () => {
      if (viewPickerIsPersisting) {
        return;
      }

      await updateViewFromCurrentState();
    },
    focusId: VIEW_PICKER_DROPDOWN_ID,
    dependencies: [viewPickerIsPersisting, updateViewFromCurrentState],
  });

  const onIconChange = ({ iconKey }: { iconKey: string }) => {
    setViewPickerIsDirty(true);
    setViewPickerSelectedIcon(iconKey);
  };

  const handleGoBack = async () => {
    await updateViewFromCurrentState();

    setViewPickerMode('list');
  };

  return (
    <DropdownContent>
      <DropdownMenuHeader
        StartComponent={
          <DropdownMenuHeaderLeftComponent
            onClick={handleGoBack}
            Icon={IconChevronLeft}
          />
        }
      >
        {t`Edit view`}
      </DropdownMenuHeader>
      <DropdownMenuItemsContainer>
        <ViewPickerIconAndNameContainer>
          <IconPicker
            onChange={onIconChange}
            selectedIconKey={viewPickerSelectedIcon}
          />
          <TextInput
            value={viewPickerInputName}
            onChange={(value) => {
              setViewPickerIsDirty(true);
              setViewPickerInputName(value);
            }}
            autoFocus
          />
        </ViewPickerIconAndNameContainer>
        <ViewPickerSelectContainer>
          <Select
            label={t`View type`}
            fullWidth
            value={viewPickerType}
            onChange={(value) => {
              setViewPickerIsDirty(true);
              setViewPickerType(value);
              setViewPickerSelectedIcon(viewTypeIconKeyMapping(value));
            }}
            options={VIEW_PICKER_TYPE_SELECT_OPTIONS.map((option) => ({
              ...option,
              label: t(option.label),
            }))}
            dropdownId={VIEW_PICKER_VIEW_TYPE_DROPDOWN_ID}
          />
        </ViewPickerSelectContainer>
        {viewPickerType === ViewType.KANBAN && (
          <ViewPickerSelectContainer>
            <Select
              label={t`Stages`}
              fullWidth
              value={viewPickerMainGroupByFieldMetadataId}
              onChange={(value) => {
                setViewPickerIsDirty(true);
                setViewPickerMainGroupByFieldMetadataId(value);
              }}
              options={
                availableFieldsForGrouping.length > 0
                  ? availableFieldsForGrouping.map((field) => ({
                      value: field.id,
                      label: field.label,
                    }))
                  : [{ value: '', label: t`No Select field` }]
              }
              dropdownId={VIEW_PICKER_KANBAN_FIELD_DROPDOWN_ID}
            />
          </ViewPickerSelectContainer>
        )}
        {viewPickerType === ViewType.CALENDAR && (
          <ViewPickerSelectContainer>
            <Select
              label={t`Date field`}
              fullWidth
              value={viewPickerCalendarFieldMetadataId}
              onChange={(value) => {
                setViewPickerIsDirty(true);
                setViewPickerCalendarFieldMetadataId(value);
              }}
              options={
                availableFieldsForCalendar.length > 0
                  ? availableFieldsForCalendar.map((field) => ({
                      value: field.id,
                      label: field.label,
                    }))
                  : [{ value: '', label: t`No Date field` }]
              }
              dropdownId={VIEW_PICKER_CALENDAR_FIELD_DROPDOWN_ID}
            />
          </ViewPickerSelectContainer>
        )}
      </DropdownMenuItemsContainer>
      <DropdownMenuSeparator />
      <DropdownMenuItemsContainer scrollable={false}>
        <ViewPickerSaveButtonContainer>
          <ViewPickerEditButton />
        </ViewPickerSaveButtonContainer>
      </DropdownMenuItemsContainer>
    </DropdownContent>
  );
};
