'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Divider,
    Alert,
    CircularProgress,
    Stack,
    Tab,
    Tabs
} from '@mui/material';
import {
    Google as GoogleIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import {
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function FirebaseAuth() {
    const router = useRouter();
    const [tab, setTab] = useState(0); // 0: Password, 1: Email Link (OTP)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Password Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Email Link Auth State (OTP)
    const [otpEmail, setOtpEmail] = useState('');

    useEffect(() => {
        // Handle Email Link Verification on mount
        if (isSignInWithEmailLink(auth, window.location.href)) {
            setLoading(true);
            let emailForSignIn = window.localStorage.getItem('emailForSignIn');
            if (!emailForSignIn) {
                // User opened link on different device. Ask for email.
                emailForSignIn = window.prompt('Please provide your email for confirmation');
            }
            if (emailForSignIn) {
                signInWithEmailLink(auth, emailForSignIn, window.location.href)
                    .then((result) => {
                        window.localStorage.removeItem('emailForSignIn');
                        handleBackendSync(result.user);
                    })
                    .catch((err) => {
                        console.error(err);
                        setError(err.message);
                        setLoading(false);
                    });
            } else {
                setLoading(false);
                setError('Could not verify email link. Please try again.');
            }
        }
    }, []);

    const handleBackendSync = async (firebaseUser: any) => {
        try {
            const idToken = await firebaseUser.getIdToken();
            const res = await fetch('/api/auth/firebase-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Backend sync failed');

            // Redirect
            router.push(data.user.role === 'admin' ? '/admin' : '/user');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleBackendSync(result.user);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Standard Firebase Email/Password Sign In
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleBackendSync(userCredential.user);
        } catch (err: any) {
            console.error('Login Error:', err);
            let msg = err.message;
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                msg = 'Invalid email or password.';
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Too many failed attempts. Please try again later.';
            }
            setError(msg);
            setLoading(false);
        }
    };

    const handleSendEmailLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfo('');

        const actionCodeSettings = {
            url: window.location.href, // Redirect back to this login page
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, otpEmail, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', otpEmail);
            setInfo('Login link sent! Check your email inbox (and spam folder) to log in.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}
            {info && <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>{info}</Alert>}

            <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{ mb: 3, py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
            >
                Continue with Google
            </Button>

            <Divider sx={{ mb: 3 }}>OR</Divider>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    mb: 3,
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
                }}
            >
                <Tab label="Password" />
                <Tab label="Get OTP Link" />
            </Tabs>

            {tab === 0 && (
                <form onSubmit={handlePasswordLogin}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                    </Button>
                </form>
            )}

            {tab === 1 && (
                <form onSubmit={handleSendEmailLink}>
                    <Typography variant="body2" color="text.secondary" mb={2} align="center">
                        We'll send a magic link to your email. Click it to log in instantly without a password.
                    </Typography>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Login Link'}
                    </Button>
                </form>
            )}
            {/* Register Link */}
            <Box textAlign="center" mt={3}>
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
        </Box>
    );
}
