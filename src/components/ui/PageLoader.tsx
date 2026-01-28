import { Box, CircularProgress, Typography } from '@mui/material';

export default function PageLoader({ message = 'Loading...' }: { message?: string }) {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#ffffff',
                zIndex: 9999,
            }}
        >
            <Box position="relative" display="inline-flex">
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#667eea',
                        'circle': { strokeLinecap: 'round' }
                    }}
                />
            </Box>
            <Typography
                variant="h6"
                sx={{
                    mt: 3,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'pulse 1.5s ease-in-out infinite'
                }}
            >
                {message}
            </Typography>
            <style jsx global>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </Box>
    );
}
