import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

export function GlobalStyles() {
  return (
    <MUIGlobalStyles
      styles={{
        '*': { boxSizing: 'border-box' },
        '*, *::before, *::after': { boxSizing: 'inherit' },
        html: { height: '100%', WebkitFontSmoothing: 'antialiased' },
        body: { margin: 0, minHeight: '100vh', height: '100%' },
        '#root': { minHeight: '100vh', height: '100%', display: 'flex', flexDirection: 'column' },
      }}
    />
  );
}