import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { IconLoader, IconAlertTriangle, IconDatabase } from 'twenty-ui/icon';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
  min-height: 200px;
`;

const StyledIcon = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledTitle = styled.h3`
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.primary};
  margin: 0 0 ${themeCssVariables.spacing[1]} 0;
`;

const StyledDescription = styled.p`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
  margin: 0;
  max-width: 320px;
`;

const StyledSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
`;

export const DashboardLoadingState = () => (
  <StyledSpinner>
    <IconLoader size={24} />
  </StyledSpinner>
);

export const DashboardEmptyState = ({
  title = 'No data yet',
  description = 'Data will appear here once available.',
}: {
  title?: string;
  description?: string;
}) => (
  <StyledContainer>
    <StyledIcon>
      <IconDatabase size={40} />
    </StyledIcon>
    <StyledTitle>{title}</StyledTitle>
    <StyledDescription>{description}</StyledDescription>
  </StyledContainer>
);

export const DashboardErrorState = ({
  title = 'Something went wrong',
  description = 'Unable to load data. Please try again later.',
}: {
  title?: string;
  description?: string;
}) => (
  <StyledContainer>
    <StyledIcon>
      <IconAlertTriangle size={40} />
    </StyledIcon>
    <StyledTitle>{title}</StyledTitle>
    <StyledDescription>{description}</StyledDescription>
  </StyledContainer>
);
