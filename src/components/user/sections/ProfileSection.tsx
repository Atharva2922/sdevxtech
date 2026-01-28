'use client';

import { Box, Paper, Typography, Stack, TextField, Button, Avatar, Grid, Alert, Snackbar } from '@mui/material';
import { User, Mail, Phone, MapPin, Save, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    image: string;
}

export default function ProfileSection() {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        image: ''
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Toast notifications
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Fetch profile data on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile', {
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to fetch profile (${res.status})`);
            }

            const data = await res.json();
            setProfileData({
                name: data.user.name || '',
                email: data.user.email || '',
                phone: data.user.phone || '',
                company: data.user.company || '',
                address: data.user.address || '',
                image: data.user.image || ''
            });
        } catch (error: unknown) {
            console.error('Profile fetch error:', error);
            setToast({ open: true, message: 'Failed to load profile', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!profileData.name.trim()) {
            setToast({ open: true, message: 'Name is required', severity: 'error' });
            return;
        }

        // Strict Email Validation (Must be @gmail.com)
        if (!profileData.email.trim() || !profileData.email.endsWith('@gmail.com')) {
            setToast({ open: true, message: 'Please enter a valid @gmail.com address', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email,
                    phone: profileData.phone,
                    company: profileData.company,
                    address: profileData.address,
                    image: profileData.image
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setToast({ open: true, message: 'Profile updated successfully!', severity: 'success' });
            setEditing(false);

            // Update localStorage user data
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                user.name = data.user.name;
                user.email = data.user.email; // Sync email
                user.phone = data.user.phone; // Sync phone
                user.company = data.user.company; // Sync company
                user.image = data.user.image;
                localStorage.setItem('user', JSON.stringify(user));
                // Dispatch event to update sidebar
                window.dispatchEvent(new Event('user-updated'));
            }
        } catch (error: unknown) {
            console.error('Profile update error:', error);
            setToast({ open: true, message: error instanceof Error ? error.message : 'Failed to update profile', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setToast({ open: true, message: 'All password fields are required', severity: 'error' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setToast({ open: true, message: 'New password must be at least 6 characters', severity: 'error' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({ open: true, message: 'New passwords do not match', severity: 'error' });
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch('/api/profile/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            setToast({ open: true, message: 'Password changed successfully!', severity: 'success' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: unknown) {
            console.error('Password change error:', error);
            setToast({ open: true, message: error instanceof Error ? error.message : 'Failed to change password', severity: 'error' });
        } finally {
            setChangingPassword(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        try {
            setToast({ open: true, message: 'Uploading photo...', severity: 'success' });

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            // Update profile data with new image URL
            setProfileData(prev => ({ ...prev, image: data.imageUrl }));

            setToast({ open: true, message: 'Photo uploaded! Click Save to apply.', severity: 'success' });
        } catch (error: unknown) {
            console.error('Upload error:', error);
            setToast({ open: true, message: error instanceof Error ? error.message : 'Failed to upload photo', severity: 'error' });
        }
    };

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="400px">
                <Typography>Loading profile...</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        Profile Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your account information
                    </Typography>
                </Box>
                <Button
                    variant={editing ? 'contained' : 'outlined'}
                    startIcon={editing ? <Save size={18} /> : <User size={18} />}
                    onClick={editing ? handleSaveProfile : () => setEditing(true)}
                    disabled={saving}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '12px',
                        ...(editing && {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }),
                    }}
                >
                    {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'center', sm: 'center' }} gap={3} mb={4}>
                    <Avatar
                        src={profileData.image}
                        sx={{
                            width: { xs: 100, sm: 80 },
                            height: { xs: 100, sm: 80 },
                            bgcolor: 'primary.main',
                            fontSize: 32
                        }}
                    >
                        {!profileData.image && profileData.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box textAlign={{ xs: 'center', sm: 'left' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Profile Picture
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            JPG, PNG or GIF. Max size 2MB
                        </Typography>
                        {editing && (
                            <>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="user-profile-file-input"
                                    type="file"
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="user-profile-file-input">
                                    <Button variant="outlined" component="span" size="small" sx={{ textTransform: 'none', borderRadius: '8px' }}>
                                        Upload Photo
                                    </Button>
                                </label>
                            </>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Full Name *
                        </Typography>
                        <TextField
                            fullWidth
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            disabled={!editing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            disabled={!editing}
                            helperText={editing ? "Must be a @gmail.com address" : ""}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Phone Number
                        </Typography>
                        <TextField
                            fullWidth
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            disabled={!editing}
                            placeholder="+1 (555) 123-4567"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Company
                        </Typography>
                        <TextField
                            fullWidth
                            value={profileData.company}
                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                            disabled={!editing}
                            placeholder="Your Company"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Address
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={profileData.address}
                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            disabled={!editing}
                            placeholder="Your address"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Change Password
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Current Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            New Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Confirm Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="outlined"
                            onClick={handleChangePassword}
                            disabled={changingPassword}
                            sx={{ textTransform: 'none', borderRadius: '12px' }}
                        >
                            {changingPassword ? 'Updating...' : 'Update Password'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ borderRadius: '12px' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
