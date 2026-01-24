'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Paper, Typography, Stack, Button, Card, CardContent, Avatar
} from '@mui/material';
import { User, LogOut, Settings, Home } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            // eslint-disable-next-line react/no-did-mount-set-state
            setUser(JSON.parse(userData));
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', p: 3 }}>
            {/* Header */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                            <User size={28} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                Welcome, {user.name}!
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<Home size={18} />}
                            onClick={() => router.push('/')}
                            sx={{ textTransform: 'none', borderRadius: '12px' }}
                        >
                            Home
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<LogOut size={18} />}
                            onClick={handleLogout}
                            color="error"
                            sx={{ textTransform: 'none', borderRadius: '12px' }}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Dashboard Content */}
            <Stack spacing={3}>
                <Typography variant="h6" fontWeight="bold">
                    User Dashboard
                </Typography>

                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3}>
                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Box p={1.5} bgcolor="#eff6ff" borderRadius="12px">
                                    <User size={24} color="#3b82f6" />
                                </Box>
                                <Typography variant="h6" fontWeight="bold">Profile</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                Manage your account settings and preferences
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Settings size={16} />}
                                sx={{ textTransform: 'none', borderRadius: '8px' }}
                            >
                                Edit Profile
                            </Button>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={1}>
                                Account Info
                            </Typography>
                            <Stack spacing={1}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {user.name}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {user.email}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500} textTransform="capitalize">
                                        {user.role}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Quick Actions
                            </Typography>
                            <Stack spacing={1}>
                                <Button
                                    variant="text"
                                    fullWidth
                                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    onClick={() => router.push('/')}
                                >
                                    View Website
                                </Button>
                                {user.role === 'admin' && (
                                    <Button
                                        variant="text"
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                        onClick={() => router.push('/admin')}
                                    >
                                        Admin Panel
                                    </Button>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Stack>
        </Box>
    );
}
