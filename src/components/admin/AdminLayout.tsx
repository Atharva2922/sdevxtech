'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export default function AdminLayout({ sidebar, children }: AdminLayoutProps) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--card-bg)' }}>
            {sidebar}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    height: '100vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
