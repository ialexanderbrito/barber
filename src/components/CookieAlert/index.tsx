import CookieConsent from 'react-cookie-consent';

const buttonCss = {
  background: '#ff9000',
  color: '#232129',
  fontSize: '13px',
  borderRadius: '10px',
  width: '80px',
  fontWeight: 'bold',
};

const css = {
  background: '#3e3b47',
  fontSize: '14px',
};

const ONE_DAY = 1;

export function CookieAlert() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="OK"
      cookieName="alert"
      style={css}
      buttonStyle={buttonCss}
      expires={ONE_DAY}
    >
      Este site está em modo de desenvolvimento, por isso, podem ocorrer erros e
      bugs.
    </CookieConsent>
  );
}
