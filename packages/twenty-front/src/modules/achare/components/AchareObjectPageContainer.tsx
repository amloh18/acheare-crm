import { ReactNode } from 'react';

interface AchareObjectPageContainerProps {
  objectNameSingular?: string;
  children: ReactNode;
}

export const AchareObjectPageContainer = ({
  children,
}: AchareObjectPageContainerProps) => {
  return <>{children}</>;
};
