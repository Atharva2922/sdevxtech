'use client';

import { AppBar, Toolbar, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

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
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '64px', md: '80px' } }}>
                        <a href="#" className="block">
                            <Image
                                src="/logo-dark.png"
                                alt="SDEVX Technology"
                                width={800}
                                height={200}
                                className="h-10 md:h-12 w-auto object-contain"
                                priority
                            />
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:block">
                            <ul className="flex gap-6 lg:gap-8">
                                {safeNavItems.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavClick(item.href);
                                            }}
                                            className="text-gray-600 hover:text-[var(--primary-color)] font-medium text-sm transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

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
                        width: 250,
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
                                    sx={{ color: '#64748b' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}
