import { styled } from '@linaria/react';
import { IconCheck, useIcons } from 'twenty-ui/icon';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type AchareChecklistItem = {
  /** Icon name from the Achare feature catalogue. Optional. */
  icon?: string;
  name: string;
  description: string;
};

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledRow = styled.li`
  align-items: flex-start;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTick = styled.span`
  align-items: center;
  background: ${themeCssVariables.background.transparent.success};
  border-radius: 50%;
  color: ${themeCssVariables.color.green};
  display: inline-flex;
  flex-shrink: 0;
  height: 22px;
  justify-content: center;
  margin-top: 1px;
  width: 22px;
`;

const StyledText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledNameRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

export type AchareChecklistProps = {
  items: AchareChecklistItem[];
};

/**
 * "Here is what you are getting" list.
 *
 * Used by the module steps that have nothing to configure — the only honest
 * thing to show is what the module turns on, so the user can decide whether to
 * continue or skip. Every row is ticked, which is exactly the promise.
 */
export const AchareChecklist = ({ items }: AchareChecklistProps) => {
  const { getIcon } = useIcons();

  return (
    <StyledList>
      {items.map((item) => {
        const Icon = item.icon !== undefined ? getIcon(item.icon) : undefined;

        return (
          <StyledRow key={item.name}>
            <StyledTick>
              <IconCheck size={12} />
            </StyledTick>
            <StyledText>
              <StyledNameRow>
                {Icon !== undefined && (
                  <Icon
                    size={14}
                    color={themeCssVariables.font.color.tertiary}
                  />
                )}
                <StyledName>{item.name}</StyledName>
              </StyledNameRow>
              <StyledDescription>{item.description}</StyledDescription>
            </StyledText>
          </StyledRow>
        );
      })}
    </StyledList>
  );
};
