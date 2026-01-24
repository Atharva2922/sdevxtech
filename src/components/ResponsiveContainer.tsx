'use client';

import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

interface ResponsiveContainerProps {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    disableGutters?: boolean;
}

export default function ResponsiveContainer({
    children,
    maxWidth = 'lg',
    disableGutters = false
}: ResponsiveContainerProps) {
    return (
        <Container
            maxWidth={maxWidth}
            disableGutters={disableGutters}
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3, md: 4 },
            }}
        >
            {children}
        </Container>
    );
}
