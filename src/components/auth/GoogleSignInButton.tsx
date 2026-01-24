'use client';

import { Button } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

export default function GoogleSignInButton() {
    const handleGoogleSignIn = () => {
        // Redirect to Google OAuth endpoint
        window.location.href = '/api/auth/google';
    };

    return (
        <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{
                py: 1.5,
                borderColor: '#dadce0',
                color: '#3c4043',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                    borderColor: '#d2e3fc',
                    backgroundColor: '#f8f9fa',
                },
            }}
        >
            Continue with Google
        </Button>
    );
}
