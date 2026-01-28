'use client';

import { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Divider } from '@mui/material';
import {
    LayoutDashboard, FolderKanban, ShoppingBag, MessageSquare,
    FileText, User, Settings, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserSidebarProps {
    currentSection: string;
    setCurrentSection: (section: string) => void;
    userName?: string;
    userEmail?: string;
    userImage?: string;
}

const SIDEBAR_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'My Projects', icon: FolderKanban, id: 'projects' },
    { label: 'Services', icon: ShoppingBag, id: 'services' },
    { label: 'Messages', icon: MessageSquare, id: 'messages' },
    { label: 'Documents', icon: FileText, id: 'documents' },
    { label: 'Profile', icon: User, id: 'profile' },
    { label: 'Settings', icon: Settings, id: 'settings' },
];

export default function UserSidebar({ currentSection, setCurrentSection, userName, userEmail, userImage }: UserSidebarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <Box
            sx={{
                width: 280,
                height: '100vh',
                bgcolor: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
            }}
        >
            {/* Logo/Brand */}
            <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h5" fontWeight="bold" sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    SDEVX
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Client Portal
                </Typography>
            </Box>

            {/* User Info */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={userImage} sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {!userImage && (userName?.charAt(0) || 'U')}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {userName || "Welcome 👋"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {userEmail || "Phone verified"}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1, p: 2 }}>
                {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;

                    return (
                        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => setCurrentSection(item.id)}
                                sx={{
                                    borderRadius: '12px',
                                    bgcolor: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: isActive ? 'rgba(102, 126, 234, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Icon
                                        size={20}
                                        color={isActive ? '#667eea' : '#64748b'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? '#667eea' : 'text.primary',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* Logout */}
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <LogOut size={20} color="#ef4444" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: 'error.main',
                        }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );
}
