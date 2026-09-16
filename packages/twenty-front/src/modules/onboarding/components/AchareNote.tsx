import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledNote = styled.div<{ tone: 'info' | 'muted' }>`
  align-items: flex-start;
  background: ${({ tone }) =>
    tone === 'info'
      ? themeCssVariables.background.transparent.blue
      : themeCssVariables.background.transparent.light};
  border: 1px solid
    ${({ tone }) =>
      tone === 'info'
        ? themeCssVariables.border.color.transparentStrong
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${({ tone }) =>
    tone === 'info'
      ? themeCssVariables.font.color.secondary
      : themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  line-height: 1.6;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledIcon = styled.span`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 20px;
`;

const StyledNoteBody = styled.div`
  min-width: 0;
`;

export type AchareNoteProps = {
  children: ReactNode;
  /**
   * `info` for "here is what we will do", `muted` for background reassurance.
   */
  tone?: 'info' | 'muted';
  icon?: ReactNode;
};

/**
 * Inline explanatory block.
 *
 * Used instead of loose grey paragraphs so that the "why" behind a question is
 * visually attached to the question rather than floating between sections.
 */
export const AchareNote = ({
  children,
  tone = 'muted',
  icon,
}: AchareNoteProps) => (
  <StyledNote tone={tone}>
    {icon !== undefined && <StyledIcon>{icon}</StyledIcon>}
    <StyledNoteBody>{children}</StyledNoteBody>
  </StyledNote>
);
