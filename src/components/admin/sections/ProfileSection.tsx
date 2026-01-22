import { Box, Paper, Typography, Stack, TextField, Button, Avatar, Grid } from '@mui/material';
import { User, Mail, Phone, MapPin, Save, Shield } from 'lucide-react';
import { useState } from 'react';

export default function ProfileSection() {
    const [editing, setEditing] = useState(false);

    return (
        <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Admin Profile Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your administrator account information
                    </Typography>
                </Box>
                <Button
                    variant={editing ? 'contained' : 'outlined'}
                    startIcon={editing ? <Save size={18} /> : <User size={18} />}
                    onClick={() => setEditing(!editing)}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '12px',
                        ...(editing && {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }),
                    }}
                >
                    {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" alignItems="center" gap={3} mb={4}>
                    <Avatar sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: 32
                    }}>
                        A
                    </Avatar>
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="h6" fontWeight="bold">
                                Profile Picture
                            </Typography>
                            <Shield size={16} color="#667eea" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            JPG, PNG or GIF. Max size 2MB
                        </Typography>
                        {editing && (
                            <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: '8px' }}>
                                Upload Photo
                            </Button>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Full Name
                        </Typography>
                        <TextField
                            fullWidth
                            defaultValue="Admin User"
                            disabled={!editing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            defaultValue="admin@test.com"
                            disabled={!editing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Phone Number
                        </Typography>
                        <TextField
                            fullWidth
                            defaultValue="+1 (555) 000-0000"
                            disabled={!editing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Role
                        </Typography>
                        <TextField
                            fullWidth
                            defaultValue="Administrator"
                            disabled
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Department
                        </Typography>
                        <TextField
                            fullWidth
                            defaultValue="System Administration"
                            disabled={!editing}
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
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Current Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            New Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Confirm Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            sx={{ textTransform: 'none', borderRadius: '12px' }}
                        >
                            Update Password
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                <Box display="flex" alignItems="start" gap={2}>
                    <Shield size={20} color="#667eea" />
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={0.5}>
                            Administrator Privileges
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You have full system access and administrative privileges. Use your permissions responsibly.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Stack>
    );
}
