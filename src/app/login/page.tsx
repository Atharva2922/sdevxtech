'use client';

import {
    Box, Paper, Typography, Stack
} from '@mui/material';
import { LogIn } from 'lucide-react';
import FirebaseAuth from '@/components/auth/FirebaseAuth';

export default function LoginPage() {
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

                    {/* Unified Auth Component */}
                    <FirebaseAuth />

                </Stack>
            </Paper>
        </Box>
    );
}
