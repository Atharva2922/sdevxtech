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
    const [tab, setTab] = useState(0); // 0: Phone, 1: Email
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    // Phone Auth State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [otpSent, setOtpSent] = useState(false);

    // Email Auth State
    const [email, setEmail] = useState('');

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

            // Success - store token if needed (though cookie is set)
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

    const setupRecaptcha = () => {
        if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            setupRecaptcha();
            const appVerifier = (window as any).recaptchaVerifier;
            const fullPhoneNumber = `+91${phoneNumber}`;

            console.log('Sending OTP to:', fullPhoneNumber);

            const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            setInfo('OTP sent to your phone.');
        } catch (err: any) {
            console.error('Firebase Phone Auth Error:', err);
            setError(err.message || 'Failed to send OTP');

            // Only clear if verifier exists
            if ((window as any).recaptchaVerifier) {
                try {
                    (window as any).recaptchaVerifier.clear();
                    (window as any).recaptchaVerifier = null;
                } catch (e) {
                    console.error('Error clearing recaptcha:', e);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationResult) return;
        setLoading(true);
        setError('');

        try {
            const result = await confirmationResult.confirm(otp);
            await handleBackendSync(result.user);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSendEmailLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: window.location.href, // Redirect back to this login page
            handleCodeInApp: true,
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setInfo('Login link sent to your email. Please check your inbox.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
                Welcome Back
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}

            <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                disabled={loading}
                sx={{ mb: 3, py: 1.5 }}
            >
                Sign in with Google
            </Button>

            <Divider sx={{ mb: 3 }}>OR</Divider>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
                <Tab icon={<PhoneIcon />} label="Phone" />
                <Tab icon={<EmailIcon />} label="Email Link" />
            </Tabs>

            {tab === 0 && (
                !otpSent ? (
                    <form onSubmit={handleSendOtp}>
                        <TextField
                            fullWidth
                            label="Phone Number (10 digits)"
                            placeholder="9876543210"
                            value={phoneNumber}
                            onChange={(e) => {
                                // Allow only numbers, max 10 digits
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPhoneNumber(val);
                            }}
                            disabled={loading}
                            sx={{ mb: 2 }}
                            required
                            slotProps={{
                                input: {
                                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>+91</Typography>,
                                    inputMode: 'numeric',
                                }
                            }}
                        />
                        <div id="recaptcha-container"></div>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || phoneNumber.length !== 10}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <TextField
                            fullWidth
                            label="Enter 6-digit Code"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => {
                                // Allow only numbers, max 6 digits
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtp(val);
                            }}
                            disabled={loading}
                            sx={{ mb: 2 }}
                            required
                            slotProps={{
                                input: {
                                    inputMode: 'numeric',
                                    style: { letterSpacing: '0.5em', fontSize: '1.2rem', textAlign: 'center' }
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify Code'}
                        </Button>
                        <Button fullWidth onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                        }} sx={{ mt: 1 }}>
                            Back
                        </Button>
                    </form>
                )
            )
            }

            {
                tab === 1 && (
                    <form onSubmit={handleSendEmailLink}>
                        <TextField
                            fullWidth
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 2 }}
                            required
                        />
                        <Button type="submit" fullWidth variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Send Magic Link'}
                        </Button>
                    </form>
                )
            }
        </Box >
    );
}
