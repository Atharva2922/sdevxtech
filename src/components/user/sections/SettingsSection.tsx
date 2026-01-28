'use client';

import { useState } from 'react';
import {
    Box, Paper, Typography, Switch, Divider, Button, Avatar, Chip,
    List, ListItem, ListItemButton, ListItemText, ListItemSecondaryAction, Alert, Snackbar,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField,
    CircularProgress
} from '@mui/material';
import {
    User, Bell, Moon, Sun, Shield, CreditCard, LogOut,
    Smartphone, Globe, ChevronRight, AlertTriangle
} from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function SettingsSection({ user }: { user?: any }) {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false,
        updates: true
    });

    const [darkMode, setDarkMode] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'info' | 'warning' | 'error'
    });

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            setSnackbar({
                open: true,
                message: 'Preferences updated successfully',
                severity: 'success'
            });
            return newState;
        });
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleUpdateProfile = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            });

            if (res.ok) {
                setSnackbar({ open: true, message: 'Profile updated! Please refresh.', severity: 'success' });
                setEditProfileOpen(false);
                // Ideally trigger a user reload here
                window.dispatchEvent(new Event('user-updated'));
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Update failed', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const auth = getAuth(app);
            await sendPasswordResetEmail(auth, user.email);
            setSnackbar({
                open: true,
                message: `Password reset email sent to ${user.email}`,
                severity: 'success'
            });
        } catch (error: any) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error.message || 'Failed to send reset email',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user?._id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await handleLogout();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete account', severity: 'error' });
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="md" mx="auto" pb={8}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your preferences for {user?.name || 'your account'}.
                </Typography>
            </Box>

            {/* Account Overview */}
            <Section title="Account" icon={User} description="Personal information">
                <Box display="flex" alignItems="center" gap={3} p={1}>
                    <Avatar
                        src={user?.image}
                        alt={user?.name}
                        sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}
                    >
                        {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="600">
                            {user?.name || 'User Name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.email || 'user@example.com'}
                        </Typography>
                        <Chip
                            label={user?.authProvider === 'google' ? "Google Linked" : "Email Verified"}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ mt: 1, height: 24 }}
                        />
                    </Box>
                    <Button variant="outlined" size="small" onClick={() => setEditProfileOpen(true)}>
                        Edit Profile
                    </Button>
                </Box>
            </Section>

            {/* Notifications */}
            <Section title="Notifications" icon={Bell} description="Manage how we contact you">
                <List disablePadding>
                    <SwitchItem
                        label="Email Notifications"
                        description="Receive updates about your projects via email"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                    />
                    <Divider variant="inset" component="li" />
                    <SwitchItem
                        label="Push Notifications"
                        description="Receive popup notifications on this device"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                    />
                    <Divider variant="inset" component="li" />
                    <SwitchItem
                        label="Product Updates"
                        description="Be the first to know about new features"
                        checked={notifications.updates}
                        onChange={() => handleNotificationChange('updates')}
                    />
                </List>
            </Section>

            {/* Appearance */}
            <Section title="Appearance" icon={darkMode ? Moon : Sun} description="Customize your interface">
                <List disablePadding>
                    <SwitchItem
                        label="Dark Mode"
                        description="Switch between light and dark themes"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        icon={darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    />
                </List>
            </Section>

            {/* Security */}
            <Section title="Security & Sessions" icon={Shield} description="Manage your account security">
                <Box p={2} bgcolor="#f8fafc" borderRadius="12px" mb={2}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Globe size={20} color="#64748b" />
                        <Box flex={1}>
                            <Typography variant="subtitle2">Chrome on Windows</Typography>
                            <Typography variant="caption" color="text.secondary">Current Session • Pune, India</Typography>
                        </Box>
                        <Chip label="Active" color="success" size="small" />
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ justifyContent: 'space-between' }}
                    onClick={handleChangePassword}
                    disabled={loading}
                >
                    Change Password
                    <ChevronRight size={18} />
                </Button>
            </Section>

            {/* Billing */}
            <Section title="Billing" icon={CreditCard} description="Manage your subscription and payment methods">
                <Box p={3} textAlign="center" color="text.secondary">
                    <Typography variant="body2">No active subscription found.</Typography>
                    <Button variant="text" color="primary" sx={{ mt: 1 }}>Upgrade Plan</Button>
                </Box>
            </Section>

            {/* Danger Zone */}
            <Box mt={6}>
                <Typography variant="h6" color="error" gutterBottom fontWeight="bold">
                    Danger Zone
                </Typography>
                <Paper
                    elevation={0}
                    sx={{
                        border: '1px solid #fee2e2',
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}
                >
                    <List disablePadding>
                        <ListItemButton onClick={handleLogout} sx={{ '&:hover': { bgcolor: '#fef2f2' } }}>
                            <ListItemIconWrapper color="#ef4444">
                                <LogOut size={20} />
                            </ListItemIconWrapper>
                            <ListItemText
                                primary="Log Out"
                                primaryTypographyProps={{ color: 'error', fontWeight: 500 }}
                                secondary="Sign out of your account on this device"
                            />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton onClick={() => setDeleteAccountOpen(true)} sx={{ '&:hover': { bgcolor: '#fef2f2' } }}>
                            <ListItemIconWrapper color="#ef4444">
                                <AlertTriangle size={20} />
                            </ListItemIconWrapper>
                            <ListItemText
                                primary="Delete Account"
                                primaryTypographyProps={{ color: 'error', fontWeight: 500 }}
                                secondary="Permanently delete your account and all data"
                            />
                        </ListItemButton>
                    </List>
                </Paper>
            </Box>

            {/* Dialogs */}

            {/* Edit Profile Dialog */}
            <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update your display name.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProfile} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)}>
                <DialogTitle color="error">Delete Account?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to permanently delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteAccountOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Delete Permanently'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

// Helper Components

function Section({ title, icon: Icon, description, children }: any) {
    return (
        <Paper elevation={0} sx={{ mb: 3, borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box p={2} borderBottom="1px solid #f1f5f9" bgcolor="#f8fafc" display="flex" alignItems="center" gap={2}>
                <Box display="flex" p={1} borderRadius="8px" bgcolor="white" border="1px solid #e2e8f0" color="text.secondary">
                    <Icon size={20} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                </Box>
            </Box>
            <Box p={3}>
                {children}
            </Box>
        </Paper>
    );
}

function SwitchItem({ label, description, checked, onChange, icon }: any) {
    return (
        <ListItem>
            {icon && (
                <Box mr={2} color="text.secondary">
                    {icon}
                </Box>
            )}
            <ListItemText
                primary={<Typography variant="subtitle2" fontWeight="500">{label}</Typography>}
                secondary={<Typography variant="caption" color="text.secondary">{description}</Typography>}
            />
            <ListItemSecondaryAction>
                <Switch edge="end" checked={checked} onChange={onChange} />
            </ListItemSecondaryAction>
        </ListItem>
    );
}

function ListItemIconWrapper({ children, color }: any) {
    return (
        <Box
            minWidth={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={color}
        >
            {children}
        </Box>
    );
}
