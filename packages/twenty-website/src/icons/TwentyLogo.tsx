import { styled } from '@linaria/react';

import { DURATION, EASING } from '@/tokens';

const LogoSvg = styled.svg`
  rect,
  path {
    transition: fill ${DURATION.md} ${EASING.gentle};
  }
`;

export type TwentyLogoProps = {
  sizePx?: number;
};

export function TwentyLogo({ sizePx = 40 }: TwentyLogoProps) {
  return (
    <LogoSvg
      fill="none"
      height={sizePx}
      viewBox="0 0 48 48"
      width={sizePx}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 9C10.9 9 10 9.9 10 11V31.5C10 32.9 11.1 34 12.5 34H17.2C18.4 34 19.4 33.2 19.8 32.1L27.6 13.8C28.2 12.4 27.2 10.8 25.7 10.8H13.8C12.8 10.8 12 10 12 9Z" fill="#4169F5"/>
      <path d="M22.5 13.5C21.9 12.1 22.9 10.5 24.4 10.5H33.2C34.3 10.5 35.2 11.4 35.2 12.5V31C35.2 32.1 34.3 33 33.2 33H29C27.9 33 27 32.1 27 31V19.8L22.5 30.2C22.1 31.1 21.2 31.7 20.2 31.7H18.5L22.5 13.5Z" fill="#8667F7"/>
      <path d="M16 23.5H29" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
    </LogoSvg>
  );
}
