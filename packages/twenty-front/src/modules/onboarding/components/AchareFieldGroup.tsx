import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledLabelRow = styled.div`
  align-items: baseline;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledCounter = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  white-space: nowrap;
`;

const StyledHint = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

const StyledError = styled.div`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

export type AchareFieldGroupProps = {
  /** The question this group answers, e.g. "Which days does your team work?". */
  label: string;
  /** One line of plain-language help shown under the label. */
  hint?: string;
  /** Optional right-aligned summary, e.g. "5 of 7 selected". */
  counter?: string;
  /** Validation message. Rendered in the danger colour. */
  error?: string;
  children: ReactNode;
};

/**
 * Label + hint + control wrapper used by every onboarding question.
 *
 * Onboarding controls used to render bare inputs with no visible label, which
 * made the checkbox grids unreadable. Routing every question through this
 * component means a control can never lose its label.
 */
export const AchareFieldGroup = ({
  label,
  hint,
  counter,
  error,
  children,
}: AchareFieldGroupProps) => (
  <StyledGroup>
    <StyledHeader>
      <StyledLabelRow>
        <StyledLabel>{label}</StyledLabel>
        {counter !== undefined && <StyledCounter>{counter}</StyledCounter>}
      </StyledLabelRow>
      {hint !== undefined && <StyledHint>{hint}</StyledHint>}
    </StyledHeader>
    {children}
    {error !== undefined && <StyledError>{error}</StyledError>}
  </StyledGroup>
);
