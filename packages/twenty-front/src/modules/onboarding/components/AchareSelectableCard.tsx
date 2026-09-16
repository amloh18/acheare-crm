import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { IconCheck } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledCard = styled.button<{ isSelected: boolean }>`
  align-items: flex-start;
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.border.color.blue
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  text-align: left;
  transition:
    background 0.12s ease,
    border-color 0.12s ease;
  width: 100%;

  &:hover:not(:disabled) {
    border-color: ${themeCssVariables.border.color.blue};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid ${themeCssVariables.border.color.blue};
    outline-offset: 2px;
  }
`;

const StyledIndicator = styled.span<{ isSelected: boolean }>`
  align-items: center;
  background: ${({ isSelected }) =>
    isSelected
      ? themeCssVariables.color.blue
      : themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: inline-flex;
  flex-shrink: 0;
  height: 18px;
  justify-content: center;
  margin-top: 1px;
  width: 18px;
`;

const StyledIconSlot = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  display: inline-flex;
  flex-shrink: 0;
  height: 32px;
  justify-content: center;
  width: 32px;
`;

const StyledText = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledTitle = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  line-height: 1.4;
`;

const StyledDescription = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

export type AchareSelectableCardProps = {
  title: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** Optional leading icon slot (already-sized element). */
  icon?: ReactNode;
  /**
   * `checkbox` for multi-select lists, `radio` for one-of-N choices. Both are
   * drawn as a tick; the distinction is only announced to assistive tech.
   */
  role?: 'checkbox' | 'radio';
};

/**
 * A card the user selects.
 *
 * Selection is shown with an explicit indicator rather than colour alone, and
 * the whole card is the hit target — the previous preset cards were plain
 * divs, so they could not be reached with a keyboard at all.
 */
export const AchareSelectableCard = ({
  title,
  description,
  isSelected,
  onClick,
  disabled = false,
  icon,
  role = 'checkbox',
}: AchareSelectableCardProps) => (
  <StyledCard
    type="button"
    isSelected={isSelected}
    onClick={onClick}
    disabled={disabled}
    role={role}
    aria-checked={isSelected}
  >
    <StyledIndicator isSelected={isSelected}>
      {isSelected && (
        <IconCheck size={12} color={themeCssVariables.font.color.inverted} />
      )}
    </StyledIndicator>
    {icon !== undefined && <StyledIconSlot>{icon}</StyledIconSlot>}
    <StyledText>
      <StyledTitle>{title}</StyledTitle>
      {description !== undefined && (
        <StyledDescription>{description}</StyledDescription>
      )}
    </StyledText>
  </StyledCard>
);

export const StyledAchareSelectableCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

export const StyledAchareSelectableCardGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export type AchareSelectableCardGroupProps = {
  children: ReactNode;
  /** `list` stacks full-width cards, `grid` pairs them up. */
  layout?: 'list' | 'grid';
};

/**
 * Lays out a set of selectable cards.
 *
 * Exists so callers never have to reach for a bare styled div — the two
 * layouts the design uses are the only two the group can produce.
 */
export const AchareSelectableCardGroup = ({
  children,
  layout = 'list',
}: AchareSelectableCardGroupProps) =>
  layout === 'grid' ? (
    <StyledAchareSelectableCardGrid>{children}</StyledAchareSelectableCardGrid>
  ) : (
    <StyledAchareSelectableCardList>{children}</StyledAchareSelectableCardList>
  );
