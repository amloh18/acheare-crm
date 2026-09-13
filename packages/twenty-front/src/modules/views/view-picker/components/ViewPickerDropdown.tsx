import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useContext, useMemo } from 'react';

import { useContextStoreObjectMetadataItem } from '@/context-store/hooks/useContextStoreObjectMetadataItem';
import { useNumberFormat } from '@/localization/hooks/useNumberFormat';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { useOpenDropdown } from '@/ui/layout/dropdown/hooks/useOpenDropdown';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useGetRecordIndexTotalCount } from '@/views/hooks/internal/useGetRecordIndexTotalCount';
import { useGetCurrentViewOnly } from '@/views/hooks/useGetCurrentViewOnly';
import { viewsFromObjectMetadataItemFamilySelector } from '@/views/states/selectors/viewsFromObjectMetadataItemFamilySelector';
import { ViewPickerContentCreateMode } from '@/views/view-picker/components/ViewPickerContentCreateMode';
import { ViewPickerContentEditMode } from '@/views/view-picker/components/ViewPickerContentEditMode';
import { ViewPickerContentEffect } from '@/views/view-picker/components/ViewPickerContentEffect';
import { ViewPickerTabItem } from '@/views/view-picker/components/ViewPickerTabItem';
import { VIEW_PICKER_DROPDOWN_ID } from '@/views/view-picker/constants/ViewPickerDropdownId';
import { useUpdateViewFromCurrentState } from '@/views/view-picker/hooks/useUpdateViewFromCurrentState';
import { useViewPickerMode } from '@/views/view-picker/hooks/useViewPickerMode';
import { viewPickerReferenceViewIdComponentState } from '@/views/view-picker/states/viewPickerReferenceViewIdComponentState';

import { IconPlus } from 'twenty-ui/icon';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';

const StyledTabsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: ${themeCssVariables.spacing[1]};
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
`;

const StyledTabsScrollContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledAddButton = styled.div`
  align-items: center;
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
  transition:
    background 0.1s ease,
    color 0.1s ease;

  &:hover {
    background: ${themeCssVariables.background.transparent.light};
    color: ${themeCssVariables.font.color.primary};
  }
`;

export const ViewPickerDropdown = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();
  const { currentView } = useGetCurrentViewOnly();
  const { objectMetadataItem } = useContextStoreObjectMetadataItem();

  const viewsOnCurrentObject = useAtomFamilySelectorValue(
    viewsFromObjectMetadataItemFamilySelector,
    { objectMetadataItemId: objectMetadataItem?.id ?? '' },
  );

  const { updateViewFromCurrentState } = useUpdateViewFromCurrentState();
  const { totalCount } = useGetRecordIndexTotalCount();
  const { formatNumber } = useNumberFormat();

  const isDropdownOpen = useAtomComponentStateValue(
    isDropdownOpenComponentState,
    VIEW_PICKER_DROPDOWN_ID,
  );

  const { viewPickerMode, setViewPickerMode } = useViewPickerMode();
  const setViewPickerReferenceViewId = useSetAtomComponentState(
    viewPickerReferenceViewIdComponentState,
  );
  const { openDropdown } = useOpenDropdown();

  const handleClickOutside = async () => {
    if (isDropdownOpen && viewPickerMode === 'edit') {
      await updateViewFromCurrentState();
    }
    setViewPickerMode('list');
  };

  const handleAddViewClick = () => {
    if (currentView?.id) {
      setViewPickerReferenceViewId(currentView.id);
    }
    setViewPickerMode('create-empty');
    openDropdown({
      dropdownComponentInstanceIdFromProps: VIEW_PICKER_DROPDOWN_ID,
    });
  };

  const allViews = useMemo(() => {
    const list = viewsOnCurrentObject ?? [];
    if (!currentView) return list;
    const exists = list.some((v) => v.id === currentView.id);
    if (!exists) {
      return [currentView, ...list];
    }
    return list;
  }, [viewsOnCurrentObject, currentView]);

  return (
    <StyledTabsWrapper>
      <StyledTabsScrollContainer>
        {allViews.map((view) => (
          <ViewPickerTabItem
            key={view.id}
            view={view}
            isCurrentView={currentView?.id === view.id}
            totalCount={currentView?.id === view.id ? totalCount : undefined}
            formatNumber={formatNumber}
            isLastView={allViews.length <= 1}
          />
        ))}
      </StyledTabsScrollContainer>
      <Dropdown
        dropdownId={VIEW_PICKER_DROPDOWN_ID}
        dropdownOffset={{ x: 0, y: 8 }}
        dropdownPlacement="bottom-start"
        onClickOutside={handleClickOutside}
        disableClickForClickableComponent
        clickableComponent={
          <StyledAddButton
            onClick={handleAddViewClick}
            title={t`Add view`}
            aria-label={t`Add view`}
          >
            <IconPlus size={theme.icon.size.md} />
          </StyledAddButton>
        }
        dropdownComponents={(() => {
          switch (viewPickerMode) {
            case 'create-empty':
            case 'create-from-current':
              return (
                <>
                  <ViewPickerContentCreateMode />
                  <ViewPickerContentEffect />
                </>
              );
            case 'edit':
              return (
                <>
                  <ViewPickerContentEditMode />
                  <ViewPickerContentEffect />
                </>
              );
            default:
              return null;
          }
        })()}
      />
    </StyledTabsWrapper>
  );
};
