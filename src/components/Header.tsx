'use client';

import { AppBar, Toolbar, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, InputBase, Box, Badge } from '@mui/material';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ navItems }: { navItems: any[] }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavClick = (href: string) => {
        setMobileOpen(false);
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const safeNavItems = navItems || [];

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: '#ffffff',
                    boxShadow: 'none',
                    borderBottom: 'none',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: '64px', md: '90px' } }}>
                        {/* 1. Logo Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: 'auto', md: '200px' } }}>
                            <a href="#" className="block">
                                <Image
                                    src="/logo-dark.png"
                                    alt="SDEVX Technology"
                                    width={800}
                                    height={200}
                                    className="h-8 md:h-10 w-auto object-contain"
                                    priority
                                />
                            </a>
                        </Box>

                        {/* 2. Search Bar (Hidden on mobile) */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                borderRadius: '50px',
                                border: '1px solid #e2e8f0',
                                padding: '6px 20px',
                                width: '300px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: '#cbd5e1',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                },
                            }}
                        >
                            <InputBase
                                placeholder="I'm looking for..."
                                sx={{ ml: 1, flex: 1, fontSize: '0.9rem', color: '#64748b' }}
                            />
                            <SearchIcon sx={{ color: '#94a3b8' }} />
                        </Box>

                        {/* 3. Navigation */}
                        <nav className="hidden md:block">
                            <ul className="flex gap-8 lg:gap-12">
                                {safeNavItems.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick(item.href);
                                            }}
                                            className="text-[#1e293b] hover:text-[var(--primary-color)] font-medium text-[0.95rem] transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* 4. Icons Section */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                            <IconButton sx={{ color: '#475569' }}>
                                <Badge color="error" variant="dot">
                                    <MailOutlineIcon />
                                </Badge>
                            </IconButton>
                            <IconButton sx={{ color: '#475569' }}>
                                <Badge color="error" variant="dot">
                                    <NotificationsNoneIcon />
                                </Badge>
                            </IconButton>
                            <IconButton sx={{ color: '#475569' }}>
                                <PersonOutlineIcon />
                            </IconButton>
                        </Box>

                        {/* Mobile Menu Button */}
                        <IconButton
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                display: { md: 'none' },
                                color: '#1a1a1a',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        background: '#ffffff',
                        borderLeft: '1px solid #e2e8f0',
                        width: 280,
                    },
                }}
            >
                <List sx={{ pt: 4 }}>
                    {safeNavItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton
                                onClick={() => handleNavClick(item.href)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    sx={{ color: '#334155' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}
