import { Box, Typography, Button, IconButton, Badge, Tooltip, Avatar, Popover, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@mui/material';
import { Save, Bell, Search, LogOut, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminHeaderProps {
    title: string;
    description: string;
    onSave?: () => void;
    showSaveButton?: boolean;
    isSaving?: boolean;
    onLogout?: () => void;
}

export default function AdminHeader({ title, description, onSave, showSaveButton = false, isSaving = false, onLogout }: AdminHeaderProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentMessages, setRecentMessages] = useState<any[]>([]);

    useEffect(() => {
        // Poll for unread messages (simple implementation)
        const checkNotifications = async () => {
            try {
                const res = await fetch('/api/admin/messages');
                if (res.ok) {
                    const data = await res.json();
                    const unread = data.messages.filter((m: any) => !m.isRead);
                    setUnreadCount(unread.length);
                    setRecentMessages(unread.slice(0, 5)); // Show top 5 unread
                }
            } catch (e) {
                console.error('Notification check failed', e);
            }
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
                        <IconButton
                            size="small"
                            sx={{ color: 'text.secondary' }}
                            onClick={handleNotificationClick}
                        >
                            <Badge badgeContent={unreadCount} color="error" max={99}>
                                <Bell size={20} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Notifications Popover */}
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        sx: { width: 320, borderRadius: '16px', mt: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                    }}
                >
                    <Box p={2} borderBottom="1px solid #f1f5f9">
                        <Typography variant="subtitle2" fontWeight="bold">Notifications</Typography>
                    </Box>
                    <List sx={{ p: 0, maxHeight: 300, overflowY: 'auto' }}>
                        {recentMessages.length > 0 ? (
                            recentMessages.map((msg) => (
                                <Box key={msg._id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 2, py: 1.5 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                                <Mail size={16} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" fontWeight="600" noWrap>
                                                    {msg.subject}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary" noWrap display="block">
                                                    {msg.fromUserId?.name} • New Message
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </Box>
                            ))
                        ) : (
                            <Box p={3} textAlign="center">
                                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
                            </Box>
                        )}
                    </List>
                    <Box p={1.5} borderTop="1px solid #f1f5f9" textAlign="center">
                        <Button
                            size="small"
                            fullWidth
                            sx={{ textTransform: 'none', borderRadius: '8px' }}
                            onClick={() => {
                                handleClose();
                                window.location.href = '/admin?section=messages';
                            }}
                        >
                            View All Messages
                        </Button>
                    </Box>
                </Popover>

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
