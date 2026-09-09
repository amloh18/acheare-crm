import { Img } from 'react-email';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    // TODO(acheare): point to the deployed ACHEARE front URL + final logo asset
    <Img
      src="https://app.acheare.com/images/icons/acheare/icon-192x192.png"
      alt="ACHEARE logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
