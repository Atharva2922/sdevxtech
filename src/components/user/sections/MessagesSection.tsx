import { Box, Paper, Typography, Stack, TextField, InputAdornment, Avatar, Chip, Button } from '@mui/material';
import { Search, Send } from 'lucide-react';

export default function MessagesSection() {
    const messages = [
        {
            id: 1,
            from: 'Project Manager',
            subject: 'Project Update - E-commerce Website',
            preview: 'Hi! Just wanted to update you on the progress...',
            time: '2 hours ago',
            unread: true,
            avatar: 'PM',
        },
        {
            id: 2,
            from: 'Design Team',
            subject: 'Mockup Review Required',
            preview: 'Please review the latest mockups and provide feedback...',
            time: '5 hours ago',
            unread: true,
            avatar: 'DT',
        },
        {
            id: 3,
            from: 'Support Team',
            subject: 'Invoice #INV-2026-001',
            preview: 'Your invoice for January services is ready...',
            time: 'Yesterday',
            unread: false,
            avatar: 'ST',
        },
        {
            id: 4,
            from: 'Development Team',
            subject: 'App Testing Phase Started',
            preview: 'We have started the testing phase for your mobile app...',
            time: '2 days ago',
            unread: false,
            avatar: 'DV',
        },
    ];

    return (
        <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Messages
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Communicate with the SDEVX team
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Send size={18} />}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        borderRadius: '12px',
                    }}
                >
                    New Message
                </Button>
            </Box>

            <TextField
                size="small"
                placeholder="Search messages..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={18} color="#94a3b8" />
                        </InputAdornment>
                    ),
                }}
                sx={{ maxWidth: 400 }}
            />

            <Stack spacing={1}>
                {messages.map((message) => (
                    <Paper
                        key={message.id}
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            bgcolor: message.unread ? '#f8fafc' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#f8fafc' },
                        }}
                    >
                        <Box display="flex" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {message.avatar}
                            </Avatar>
                            <Box flex={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="start" mb={0.5}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {message.from}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={message.unread ? 600 : 400}>
                                            {message.subject}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {message.unread && (
                                            <Chip
                                                label="New"
                                                size="small"
                                                color="primary"
                                                sx={{ height: 20, borderRadius: '4px' }}
                                            />
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            {message.time}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {message.preview}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Stack>
    );
}
