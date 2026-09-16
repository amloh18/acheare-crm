import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconPlus } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type AchareChipOption = {
  /** Stable identifier sent to the server. */
  value: string;
  /** What the user reads. Never omit it — the label is the whole point. */
  label: string;
};

const StyledChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledChip = styled.button<{ isSelected: boolean }>`
  align-items: center;
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[1]};
  line-height: 1.2;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;
  user-select: none;

  &:hover:not(:disabled) {
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 2px solid ${themeCssVariables.border.color.blue};
    outline-offset: 2px;
  }
`;

const StyledOrderBadge = styled.span<{ isSelected: boolean }>`
  align-items: center;
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.border.color.blue
      : themeCssVariables.background.transparent.medium};
  border-radius: 50%;
  color: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.font.color.inverted
      : themeCssVariables.font.color.tertiary};
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.xxs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  height: 16px;
  justify-content: center;
  min-width: 16px;
  padding: 0 4px;
`;

const StyledAddChip = styled.button`
  align-items: center;
  background: none;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};

  &:hover {
    border-color: ${themeCssVariables.border.color.blue};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledAddForm = styled.div`
  align-items: center;
  border: 1px solid ${themeCssVariables.border.color.blue};
  border-radius: ${themeCssVariables.border.radius.pill};
  display: inline-flex;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[1]}
    ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
`;

const StyledAddInput = styled.input`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.primary};
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.sm};
  min-width: 120px;
  outline: none;
  padding: 0;

  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledAddConfirm = styled.button`
  background: ${themeCssVariables.color.blue};
  border: none;
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export type AchareOptionChipsProps = {
  options: AchareChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Renders a position badge so the reading order is obvious (pipelines). */
  isOrdered?: boolean;
  /** When provided, an "Add your own" affordance is rendered. */
  onAddOption?: (value: string) => void;
  addOptionPlaceholder?: string;
  disabled?: boolean;
};

/**
 * Multi-select as labelled pills.
 *
 * Replaces the bare `<Checkbox>` grids that used to sit here: a row of
 * unlabelled checkboxes told the user nothing about what each box toggled.
 * Every chip carries its own label, and the selected state is shown twice —
 * fill and border, plus a tick — so it does not rely on colour alone.
 */
export const AchareOptionChips = ({
  options,
  selected,
  onToggle,
  isOrdered = false,
  onAddOption,
  addOptionPlaceholder,
  disabled = false,
}: AchareOptionChipsProps) => {
  const { t } = useLingui();
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const selectedSet = new Set(selected);

  const closeAddForm = () => {
    setIsAdding(false);
    setDraft('');
  };

  const commitDraft = () => {
    const value = draft.trim();

    if (value.length === 0) {
      closeAddForm();

      return;
    }

    if (!selectedSet.has(value)) {
      onToggle(value);
    }

    onAddOption?.(value);
    closeAddForm();
  };

  return (
    <StyledChipRow>
      {options.map((option, index) => {
        const isSelected = selectedSet.has(option.value);

        return (
          <StyledChip
            key={option.value}
            type="button"
            isSelected={isSelected}
            onClick={() => onToggle(option.value)}
            disabled={disabled}
            aria-pressed={isSelected}
          >
            {isOrdered && (
              <StyledOrderBadge isSelected={isSelected}>
                {index + 1}
              </StyledOrderBadge>
            )}
            {option.label}
            {isSelected && !isOrdered && <IconCheck size={12} />}
          </StyledChip>
        );
      })}

      {onAddOption !== undefined &&
        (isAdding ? (
          <StyledAddForm>
            <StyledAddInput
              ref={inputRef}
              value={draft}
              placeholder={addOptionPlaceholder ?? t`Type a name`}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitDraft();
                }

                if (event.key === 'Escape') {
                  closeAddForm();
                }
              }}
              disabled={disabled}
            />
            <StyledAddConfirm
              type="button"
              onClick={commitDraft}
              disabled={disabled || draft.trim().length === 0}
            >
              {t`Add`}
            </StyledAddConfirm>
          </StyledAddForm>
        ) : (
          <StyledAddChip
            type="button"
            onClick={() => setIsAdding(true)}
            disabled={disabled}
          >
            <IconPlus size={12} />
            {t`Add your own`}
          </StyledAddChip>
        ))}
    </StyledChipRow>
  );
};
