'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, TextField, InputAdornment, Avatar, Chip, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, Send } from 'lucide-react';

interface Message {
    _id: string;
    from: string;
    fromUserId: { _id: string, name: string, image: string };
    toUserId: { _id: string, name: string, image: string };
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesSection() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Send Message Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({ subject: '', message: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/user/messages');
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!formData.subject || !formData.message) return;
        setSending(true);
        try {
            const res = await fetch('/api/user/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Failed to send message');

            await fetchMessages();
            setOpenDialog(false);
            setFormData({ subject: '', message: '' });
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredMessages = messages.filter(m =>
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        (m.fromUserId?.name || 'System').toLowerCase().includes(search.toLowerCase())
    );

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
                    onClick={() => setOpenDialog(true)}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search size={18} color="#94a3b8" />
                        </InputAdornment>
                    ),
                }}
                sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            {loading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && filteredMessages.length === 0 && (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Typography color="text.secondary">No messages found.</Typography>
                </Paper>
            )}

            <Stack spacing={1}>
                {filteredMessages.map((msg) => (
                    <Paper
                        key={msg._id}
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            bgcolor: !msg.isRead && msg.from !== 'user' ? '#f8fafc' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#f8fafc' },
                        }}
                    >
                        <Box display="flex" gap={2}>
                            <Avatar src={msg.fromUserId?.image} sx={{ bgcolor: 'primary.main' }}>
                                {msg.fromUserId?.name ? msg.fromUserId.name.charAt(0) : 'S'}
                            </Avatar>
                            <Box flex={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="start" mb={0.5}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {msg.fromUserId?.name || 'System'}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={msg.from !== 'user' && !msg.isRead ? 600 : 400}>
                                            {msg.subject}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {msg.from !== 'user' && !msg.isRead && (
                                            <Chip
                                                label="New"
                                                size="small"
                                                color="primary"
                                                sx={{ height: 20, borderRadius: '4px' }}
                                            />
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            {formatTime(msg.createdAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {msg.message}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Stack>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: '16px', maxWidth: 500, width: '100%' } }}
            >
                <DialogTitle fontWeight="bold">New Message</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Subject"
                            fullWidth
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: '8px' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={sending}
                        sx={{ borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        {sending ? 'Sending...' : 'Send Message'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
