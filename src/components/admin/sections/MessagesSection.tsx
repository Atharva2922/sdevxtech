import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Avatar, Chip, CircularProgress, Alert, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { Mail } from 'lucide-react';

interface Message {
    _id: string;
    fromUserId: {
        _id: string;
        name: string;
        email: string;
        image: string;
    };
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessagesSection() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [replySubject, setReplySubject] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/messages');
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReply = (msg: Message) => {
        setReplyTo(msg);
        setReplySubject(`Re: ${msg.subject}`);
        setOpenReplyDialog(true);
    };

    const handleSendReply = async () => {
        if (!replySubject || !replyMessage || !replyTo) return;
        setSending(true);

        try {
            const res = await fetch('/api/user/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toUserId: replyTo.fromUserId._id,
                    subject: replySubject,
                    message: replyMessage
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send reply');
            }

            setToast({ open: true, message: 'Reply sent successfully', severity: 'success' });
            setOpenReplyDialog(false);
            setReplyMessage('');
            // Optionally refresh messages if you want to show the sent reply in a thread view
        } catch (err: unknown) {
            setToast({ open: true, message: err instanceof Error ? err.message : 'Failed to send', severity: 'error' });
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" fontWeight="bold">
                    Client Messages
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    View inquiries and support requests from users
                </Typography>
            </Box>

            {loading && <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && messages.length === 0 && (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Mail size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                    <Typography color="text.secondary">No messages found.</Typography>
                </Paper>
            )}

            {!loading && !error && (
                <Stack spacing={2}>
                    {messages.map((msg) => (
                        <Paper
                            key={msg._id}
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s',
                                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                            }}
                        >
                            <Box display="flex" gap={2} alignItems="flex-start">
                                <Avatar
                                    src={msg.fromUserId?.image}
                                    sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                                >
                                    {msg.fromUserId?.name?.charAt(0) || 'U'}
                                </Avatar>
                                <Box flex={1}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {msg.fromUserId?.name || 'Unknown User'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {msg.fromUserId?.email}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip
                                                label={msg.isRead ? 'Read' : 'New'}
                                                size="small"
                                                color={msg.isRead ? 'default' : 'error'}
                                                variant={msg.isRead ? 'outlined' : 'filled'}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatTime(msg.createdAt)}
                                            </Typography>
                                        </Stack>
                                    </Box>

                                    <Box bgcolor="#f8fafc" p={2} borderRadius="12px" border="1px solid #e2e8f0">
                                        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                                            {msg.subject}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {msg.message}
                                        </Typography>
                                    </Box>

                                    <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ borderRadius: '8px', textTransform: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                            onClick={() => handleOpenReply(msg)}
                                        >
                                            Reply
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
            {/* Reply Dialog */}
            <Dialog
                open={openReplyDialog}
                onClose={() => setOpenReplyDialog(false)}
                PaperProps={{ sx: { borderRadius: '16px', maxWidth: 500, width: '100%' } }}
            >
                <DialogTitle fontWeight="bold">
                    Reply to {replyTo?.fromUserId?.name}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Subject"
                            fullWidth
                            value={replySubject}
                            onChange={(e) => setReplySubject(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenReplyDialog(false)} sx={{ borderRadius: '8px' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSendReply}
                        disabled={sending}
                        sx={{ borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        {sending ? 'Sending...' : 'Send Reply'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ borderRadius: '12px' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
