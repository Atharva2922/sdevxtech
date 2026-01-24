'use client';

import { Box, IconButton, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface AdminLayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export default function AdminLayout({ sidebar, children }: AdminLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--card-bg)' }}>
            {/* Mobile Menu Button */}
            {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        left: 16,
                        zIndex: 1300,
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'white' }
                    }}
                >
                    <MenuIcon size={24} />
                </IconButton>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && sidebar}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 280,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {sidebar}
                </Drawer>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    pt: { xs: 10, md: 4 }, // Extra top padding on mobile for menu button
                    height: '100vh',
                    overflowY: 'auto',
                    position: 'relative',
                    width: { xs: '100%', md: 'calc(100% - 280px)' }
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
