'use client';

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider } from '@mui/material';
import {
    LayoutDashboard, Users, FileText, CreditCard,
    BarChart3, Settings, Shield, Activity, ChevronRight
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Users', icon: Users, id: 'users' },
    { label: 'Content / Data', icon: FileText, id: 'content' },
    { label: 'Transactions', icon: CreditCard, id: 'transactions' },
    { label: 'Analytics / Reports', icon: BarChart3, id: 'analytics' },
    { label: 'System / Settings', icon: Settings, id: 'settings' },
    { label: 'Roles & Permissions', icon: Shield, id: 'roles' },
    { label: 'Logs & Support', icon: Activity, id: 'logs' },
];

interface AdminSidebarProps {
    currentSection: string;
    setCurrentSection: (id: string) => void;
}

export default function AdminSidebar({ currentSection, setCurrentSection }: AdminSidebarProps) {
    return (
        <Box sx={{
            width: 280,
            flexShrink: 0,
            bgcolor: 'var(--card-bg)', // Using CSS variable
            borderRight: '1px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <Box p={3} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{
                    bgcolor: 'var(--primary-color)',
                    width: 40,
                    height: 40,
                    boxShadow: '0 0 15px var(--accent-glow)'
                }}>S</Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ lineHeight: 1.2 }}>
                        SDEVX
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Admin Console
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 2, opacity: 0.5 }} />

            <List component="nav" sx={{ px: 2, flex: 1, overflowY: 'auto' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2, mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Main Menu
                </Typography>
                {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    return (
                        <ListItemButton
                            key={item.id}
                            selected={isActive}
                            onClick={() => setCurrentSection(item.id)}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.5,
                                transition: 'all 0.2s',
                                bgcolor: isActive ? 'rgba(99, 102, 241, 0.08) !important' : 'transparent',
                                color: isActive ? 'var(--primary-color)' : 'text.secondary',
                                '&:hover': {
                                    bgcolor: 'rgba(99, 102, 241, 0.04)',
                                    color: 'var(--primary-color)',
                                    transform: 'translateX(4px)',
                                    '& .MuiListItemIcon-root': { color: 'var(--primary-color)' }
                                },
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: isActive ? 'var(--primary-color)' : 'text.secondary',
                            }}>
                                <Icon size={20} />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.9rem'
                                }}
                            />
                            {isActive && <ChevronRight size={16} />}
                        </ListItemButton>
                    );
                })}
            </List>

            <Box p={3}>
                <Box p={2} borderRadius={3} sx={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.1)'
                }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
                            AD
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="text.primary">
                                Admin User
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                admin@sdevx.com
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
