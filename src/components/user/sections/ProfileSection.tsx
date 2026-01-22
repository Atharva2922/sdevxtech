import { Box, Paper, Typography, Stack, TextField, Button, Avatar, Grid } from '@mui/material';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useState } from 'react';

export default function ProfileSection() {
    const [editing, setEditing] = useState(false);

    return (
        <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Profile Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your account information
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
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
                        U
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Profile Picture
                        </Typography>
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
                            defaultValue="John Doe"
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
                            defaultValue="john.doe@example.com"
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
                            defaultValue="+1 (555) 123-4567"
                            disabled={!editing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Company
                        </Typography>
                        <TextField
                            fullWidth
                            defaultValue="Acme Corp"
                            disabled={!editing}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                            Address
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            defaultValue="123 Main St, Suite 100, San Francisco, CA 94105"
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
        </Stack>
    );
}
