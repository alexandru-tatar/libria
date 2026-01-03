import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

const lightPalette = {
    mode: 'light' as const,
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f7', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#4b5563' },
    divider: '#e5e7eb',
    grey: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
};

const darkPalette = {
    mode: 'dark' as const,
    primary: { main: '#e95420' },
    background: { default: '#1f2023', paper: '#26282d' },
    text: { primary: '#f3f4f6', secondary: '#c7c9d1' },
    divider: '#34363c',
    grey: {
        50: '#2a2c31',
        100: '#2f3237',
        200: '#35383e',
        300: '#3b3e45',
        400: '#41454d',
        500: '#474b54',
        600: '#4d525c',
        700: '#545965',
        800: '#5b6170',
        900: '#636a7b',
    },
};

export const createAppTheme = (mode: PaletteMode = 'light') =>
    createTheme({
        palette: mode === 'dark' ? darkPalette : lightPalette,
        typography: {
            fontFamily:
                '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            h1: { fontWeight: 700 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 700 },
            button: {
                textTransform: 'none',
                fontWeight: 600,
            },
        },
        shape: {
            borderRadius: 12,
        },
    });
