import { useCallback, useEffect, useMemo, useState } from 'react';
import { CssBaseline, type PaletteMode } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './theme';
import { GlobalStyles } from './GlobalStyles';
import { ThemeModeContext, type ThemeModeContextValue } from './themeMode';

const STORAGE_KEY = 'libria.theme';

const readInitialMode = (): PaletteMode => {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
};

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(readInitialMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode,
      setMode,
    }),
    [mode, toggleMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
