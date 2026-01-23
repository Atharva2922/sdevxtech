'use client';

import { Box, Typography, Button, IconButton, Badge, Tooltip, Avatar } from '@mui/material';
import { Save, Bell, Search, LogOut } from 'lucide-react';

interface AdminHeaderProps {
    title: string;
    description: string;
    onSave?: () => void;
    showSaveButton?: boolean;
    isSaving?: boolean;
    onLogout?: () => void;
}

export default function AdminHeader({ title, description, onSave, showSaveButton = false, isSaving = false, onLogout }: AdminHeaderProps) {
    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                position: 'sticky',
                top: 0,
                zIndex: 5,
                bgcolor: 'rgba(248, 250, 252, 0.8)', // Semi-transparent background
                backdropFilter: 'blur(8px)',
                mx: -4,
                px: 4,
                py: 2,
                borderBottom: '1px solid transparent',
                transition: 'all 0.3s',
            }}
        >
            <Box>
                <Typography variant="h5" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {description}
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" gap={1} mr={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Tooltip title="Search">
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <Search size={20} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications">
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <Badge badgeContent={3} color="error" variant="dot">
                                <Bell size={20} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </Box>

                {showSaveButton && onSave && (
                    <Button
                        variant="contained"
                        startIcon={<Save size={18} />}
                        onClick={onSave}
                        disabled={isSaving}
                        sx={{
                            bgcolor: 'var(--primary-color)',
                            px: 3,
                            py: 1,
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: 'var(--primary-color)',
                                opacity: 0.9,
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            },
                            '&:disabled': {
                                bgcolor: 'var(--text-muted)',
                                color: 'white'
                            },
                            mr: 2
                        }}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                )}

                <Tooltip title="Logout">
                    <IconButton size="small" onClick={onLogout} sx={{ color: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
                        <LogOut size={20} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
