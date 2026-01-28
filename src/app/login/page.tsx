'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Paper, TextField, Button, Typography, Alert, Stack, InputAdornment,
    IconButton, Divider, Tabs, Tab
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import FirebaseAuth from '@/components/auth/FirebaseAuth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'firebase' | 'password'>('firebase');

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token in localStorage as backup
            localStorage.setItem('auth-token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role and profile completion
            if (data.user.role === 'admin') {
                if (data.isProfileComplete) {
                    router.push('/admin');
                } else {
                    router.push('/admin?section=profile');
                }
            } else {
                if (data.isProfileComplete) {
                    router.push('/user');
                } else {
                    router.push('/user?section=profile');
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                p: 2
            }}
        >
            <Paper
                elevation={24}
                sx={{
                    maxWidth: 450,
                    width: '100%',
                    p: 4,
                    borderRadius: '24px',
                    background: '#ffffff',
                }}
            >
                <Stack spacing={3}>
                    {/* Logo/Header */}
                    <Box textAlign="center">
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
                            }}
                        >
                            <LogIn size={32} color="white" />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to access your dashboard
                        </Typography>
                    </Box>

                    {/* Login Method Tabs */}
                    <Tabs
                        value={loginMethod}
                        onChange={(_, newValue) => setLoginMethod(newValue)}
                        centered
                        variant="fullWidth"
                        sx={{
                            mb: 1,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                            }
                        }}
                    >
                        <Tab label="Quick Login" value="firebase" />
                        <Tab label="Password" value="password" />
                    </Tabs>

                    {/* Firebase Login (Google, Phone, Email Link) */}
                    {loginMethod === 'firebase' && (
                        <FirebaseAuth />
                    )}

                    {/* Password Login Form */}
                    {loginMethod === 'password' && (
                        <form onSubmit={handlePasswordLogin}>
                            <Stack spacing={2.5}>
                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: '12px' }}>
                                        {error}
                                    </Alert>
                                )}
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Mail size={20} color="#94a3b8" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={20} color="#94a3b8" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        borderRadius: '12px',
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            boxShadow: '0 6px 30px rgba(102, 126, 234, 0.6)',
                                        }
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Stack>
                        </form>
                    )}

                    {/* Register Link */}
                    <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Don&apos;t have an account?{' '}
                            <Button
                                variant="text"
                                onClick={() => router.push('/register')}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Create Account
                            </Button>
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
