'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Paper, TextField, Button, Typography, Alert, Stack, InputAdornment,
    IconButton, Divider
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Redirect to login page after successful registration
            router.push('/login?registered=true');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed');
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
                            <UserPlus size={32} color="white" />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Create Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join us to get started
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleRegister}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <User size={20} color="#94a3b8" />
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </Stack>
                    </form>

                    <Divider sx={{ my: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>

                    {/* Login Link */}
                    <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Button
                                variant="text"
                                onClick={() => router.push('/login')}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Sign In
                            </Button>
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
