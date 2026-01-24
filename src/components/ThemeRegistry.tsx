'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useMemo } from 'react';

export default function ThemeRegistry({
    children,
    themeColor = '#6366f1',
    secondaryColor = '#d946ef',
    backgroundColor = '#ffffff',
    paperColor = '#f8fafc'
}: {
    children: React.ReactNode,
    themeColor?: string,
    secondaryColor?: string,
    backgroundColor?: string,
    paperColor?: string
}) {
    const theme = useMemo(() => createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: themeColor,
            },
            secondary: {
                main: secondaryColor,
            },
            background: {
                default: backgroundColor,
                paper: paperColor,
            },
            text: {
                primary: '#1a1a1a',
                secondary: '#64748b',
            },
        },
        typography: {
            fontFamily: 'var(--font-outfit), sans-serif',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: '8px',
                    },
                },
            },
        }
    }), [themeColor, secondaryColor, backgroundColor, paperColor]);

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
