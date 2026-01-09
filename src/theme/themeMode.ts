import { createContext, useContext } from 'react';
import type { PaletteMode } from '@mui/material';

export type ThemeModeContextValue = {
    mode: PaletteMode;
    toggleMode: () => void;
    setMode: (mode: PaletteMode) => void;
};

export const ThemeModeContext = createContext<
    ThemeModeContextValue | undefined
>(undefined);

export function useThemeMode() {
    const ctx = useContext(ThemeModeContext);
    if (!ctx)
        throw new Error('useThemeMode must be used inside ThemeModeProvider');
    return ctx;
}
