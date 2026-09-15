import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useRemoveRecordFilter } from '@/object-record/record-filter/hooks/useRemoveRecordFilter';
import { useUpsertRecordFilter } from '@/object-record/record-filter/hooks/useUpsertRecordFilter';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { styled } from '@linaria/react';
import { ViewFilterOperand } from 'twenty-shared/types';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconCalendar } from 'twenty-ui/icon';
import { MenuItem } from 'twenty-ui/navigation';
import { FieldMetadataType } from '~/generated-metadata/graphql';

const DROPDOWN_ID = 'requirements-time-filter-dropdown';
const TIME_FILTER_RECORD_ID = 'requirements-time-filter';

type TimeRangeKey =
  | 'TODAY'
  | 'THIS_WEEK'
  | 'MONTH'
  | 'QUARTER'
  | 'YEAR'
  | 'ALL';

const TIME_OPTIONS: { key: TimeRangeKey; label: string; value?: string }[] = [
  { key: 'TODAY', label: 'Today', value: 'THIS_1_DAY' },
  { key: 'THIS_WEEK', label: 'This week', value: 'THIS_1_WEEK' },
  { key: 'MONTH', label: 'Month', value: 'THIS_1_MONTH' },
  { key: 'QUARTER', label: 'Quarter', value: 'THIS_1_QUARTER' },
  { key: 'YEAR', label: 'Year', value: 'THIS_1_YEAR' },
  { key: 'ALL', label: 'All' },
];

const StyledDropdownButton = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[2]};
  height: 28px;
  outline: none;
  padding: 2px 8px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

export const RequirementsTimeFilter = () => {
  const { fieldMetadataItemByFieldMetadataItemId } =
    useRecordIndexContextOrThrow();

  const currentRecordFilters = useAtomComponentStateValue(
    currentRecordFiltersComponentState,
  );

  const { upsertRecordFilter } = useUpsertRecordFilter();
  const { removeRecordFilter } = useRemoveRecordFilter();

  const createdAtField = Object.values(
    fieldMetadataItemByFieldMetadataItemId,
  ).find((field) => field.name === 'createdAt' || field.name === 'receivedAt');

  const activeTimeFilter = currentRecordFilters?.find(
    (filter) => filter.id === TIME_FILTER_RECORD_ID,
  );

  const getActiveKey = (): TimeRangeKey => {
    if (!activeTimeFilter) return 'ALL';
    const match = TIME_OPTIONS.find(
      (opt) => opt.value === activeTimeFilter.value,
    );
    return match?.key ?? 'ALL';
  };

  const activeKey = getActiveKey();
  const activeLabel = TIME_OPTIONS.find((opt) => opt.key === activeKey)?.label ?? 'All';

  const handleSelectTimeRange = (option: (typeof TIME_OPTIONS)[number]) => {
    if (option.key === 'ALL' || !option.value) {
      removeRecordFilter({ recordFilterId: TIME_FILTER_RECORD_ID });
    } else if (createdAtField) {
      upsertRecordFilter({
        id: TIME_FILTER_RECORD_ID,
        fieldMetadataId: createdAtField.id,
        value: option.value,
        displayValue: option.label,
        type: FieldMetadataType.DATE_TIME,
        operand: ViewFilterOperand.IS_RELATIVE,
        label: createdAtField.label,
      });
    }
  };

  return (
    <Dropdown
      dropdownId={DROPDOWN_ID}
      clickableComponent={
        <StyledDropdownButton type="button">
          <IconCalendar size={14} />
          {activeLabel}
        </StyledDropdownButton>
      }
      dropdownComponents={
        <DropdownMenuItemsContainer>
          {TIME_OPTIONS.map((option) => (
            <MenuItem
              key={option.key}
              text={option.label}
              onClick={() => handleSelectTimeRange(option)}
              accent={activeKey === option.key ? 'placeholder' : 'default'}
            />
          ))}
        </DropdownMenuItemsContainer>
      }
      dropdownPlacement="bottom-end"
    />
  );
};
