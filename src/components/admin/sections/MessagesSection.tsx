import { useState, useEffect, useMemo } from 'react';
import {
    Box, Paper, Typography, Stack, Avatar, Button, IconButton,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, Badge, CircularProgress, useMediaQuery, useTheme
} from '@mui/material';
import { Search, Send, MoreVertical, Phone, Video, ArrowLeft, CheckCheck } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
}

interface Message {
    _id: string;
    fromUserId: User;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface Thread {
    user: User;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
}

export default function AdminMessagesSection() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    // Group messages by user to create threads
    const threads = useMemo(() => {
        const threadMap = new Map<string, Thread>();

        messages.forEach(msg => {
            // Group by the sender (user). ignoring admin's own replies for grouping logic for now
            // assuming all messages fetched here are FROM users.
            // If backend returns mixed (sent & received), logic needs adjustment.
            // Based on previous code, this fetches "Client Messages", so likely just incoming.
            const userId = msg.fromUserId?._id;
            if (!userId) return;

            if (!threadMap.has(userId)) {
                threadMap.set(userId, {
                    user: msg.fromUserId,
                    messages: [],
                    lastMessage: msg,
                    unreadCount: 0
                });
            }

            const thread = threadMap.get(userId)!;
            thread.messages.push(msg);
            if (!msg.isRead) thread.unreadCount++;

            // Keep track of the very latest message for sorting/preview
            if (new Date(msg.createdAt) > new Date(thread.lastMessage.createdAt)) {
                thread.lastMessage = msg;
            }
        });

        // Sort threads by latest message date descending
        return Array.from(threadMap.values()).sort((a, b) =>
            new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
        ).filter(t =>
            t.user.name.toLowerCase().includes(search.toLowerCase()) ||
            t.user.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [messages, search]);

    const activeThread = threads.find(t => t.user._id === selectedThreadId);

    const handleSendReply = async () => {
        if (!replyText.trim() || !activeThread) return;
        setSending(true);
        try {
            const res = await fetch('/api/user/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toUserId: activeThread.user._id,
                    subject: `Re: ${activeThread.lastMessage.subject}`, // Generic subject for chat-like reply
                    message: replyText
                })
            });

            if (!res.ok) throw new Error('Failed to send reply');

            setToast({ open: true, message: 'Reply sent', severity: 'success' });
            setReplyText('');
            // Ideally activeThread.messages would update here efficiently, 
            // but for simple sync we can refetch or just pretend active for now.
            await fetchMessages();

        } catch (err: unknown) {
            setToast({ open: true, message: 'Failed to send', severity: 'error' });
        } finally {
            setSending(false);
        }
    };

    const formatTimeShort = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <Paper
            elevation={0}
            sx={{
                height: 'calc(100vh - 120px)',
                minHeight: '600px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                bgcolor: '#fff'
            }}
        >
            {/* Sidebar - Thread List */}
            <Box
                sx={{
                    width: { xs: '100%', md: '320px', lg: '380px' },
                    borderRight: '1px solid #f1f5f9',
                    display: isMobile && selectedThreadId ? 'none' : 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fafafa'
                }}
            >
                <Box p={2} borderBottom="1px solid #f1f5f9" bgcolor="#fff">
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Inbox</Typography>
                    <TextField
                        placeholder="Search messages..."
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <Search size={18} className="text-gray-400 mr-2" />,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#f8fafc',
                                borderRadius: '10px'
                            }
                        }}
                    />
                </Box>

                <Stack sx={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}><CircularProgress size={24} /></Box>
                    ) : threads.length === 0 ? (
                        <Box p={4} textAlign="center" color="text.secondary">No messages</Box>
                    ) : (
                        threads.map(thread => (
                            <Box
                                key={thread.user._id}
                                onClick={() => setSelectedThreadId(thread.user._id)}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f8fafc',
                                    bgcolor: selectedThreadId === thread.user._id ? '#eef2ff' : 'transparent',
                                    transition: 'all 0.1s',
                                    '&:hover': { bgcolor: selectedThreadId === thread.user._id ? '#eef2ff' : '#f8fafc' },
                                    display: 'flex',
                                    gap: 2,
                                    position: 'relative'
                                }}
                            >
                                {thread.unreadCount > 0 && (
                                    <Box
                                        sx={{
                                            position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
                                            width: 4, height: 40, bgcolor: 'primary.main', borderRadius: '4px'
                                        }}
                                    />
                                )}
                                <Avatar
                                    src={thread.user.image}
                                    sx={{ width: 48, height: 48, border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                >
                                    {thread.user.name[0]}
                                </Avatar>
                                <Box flex={1} minWidth={0}>
                                    <Box display="flex" justifyContent="space-between" alignItems="baseline">
                                        <Typography variant="subtitle2" fontWeight={thread.unreadCount > 0 ? 700 : 500} noWrap>
                                            {thread.user.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                                            {formatTimeShort(thread.lastMessage.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color={thread.unreadCount > 0 ? 'text.primary' : 'text.secondary'} fontWeight={thread.unreadCount > 0 ? 500 : 400} noWrap>
                                        {thread.lastMessage.subject}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                        {thread.lastMessage.message}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    )}
                </Stack>
            </Box>

            {/* Main Content - Chat Area */}
            <Box
                sx={{
                    flex: 1,
                    display: isMobile && !selectedThreadId ? 'none' : 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fff',
                    position: 'relative'
                }}
            >
                {activeThread ? (
                    <>
                        {/* Header */}
                        <Box
                            p={2}
                            borderBottom="1px solid #f1f5f9"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            bgcolor="#fff"
                        >
                            <Box display="flex" alignItems="center" gap={2}>
                                {isMobile && (
                                    <IconButton onClick={() => setSelectedThreadId(null)} size="small">
                                        <ArrowLeft size={20} />
                                    </IconButton>
                                )}
                                <Avatar src={activeThread.user.image} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                                        {activeThread.user.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {activeThread.user.email}
                                    </Typography>
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <IconButton size="small"><Phone size={18} /></IconButton>
                                <IconButton size="small"><Video size={18} /></IconButton>
                                <IconButton size="small"><MoreVertical size={18} /></IconButton>
                            </Stack>
                        </Box>

                        {/* Messages Stream */}
                        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc' }}>
                            <Stack spacing={3}>
                                {activeThread.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg, idx) => (
                                    <Box key={msg._id} display="flex" gap={2} alignItems="flex-start">
                                        <Avatar
                                            src={activeThread.user.image}
                                            sx={{ width: 32, height: 32, mt: 0.5, opacity: 0.8 }}
                                        >
                                            {activeThread.user.name[0]}
                                        </Avatar>
                                        <Box sx={{ maxWidth: '80%' }}>
                                            <Box display="flex" alignItems="baseline" gap={1} mb={0.5}>
                                                <Typography variant="caption" fontWeight="bold" color="text.primary">
                                                    {activeThread.user.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '0 12px 12px 12px',
                                                    bgcolor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                }}
                                            >
                                                {msg.subject && (
                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                        {msg.subject}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                    {msg.message}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        {/* Reply Area */}
                        <Box p={2} borderTop="1px solid #f1f5f9" bgcolor="#fff">
                            <Box
                                sx={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    p: 1,
                                    '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)' }
                                }}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder={`Reply to ${activeThread.user.name}...`}
                                    variant="standard"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    InputProps={{ disableUnderline: true }}
                                    sx={{ px: 1 }}
                                />
                                <Box display="flex" justifyContent="flex-end" px={1} pb={0.5}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={!replyText.trim() || sending}
                                        onClick={handleSendReply}
                                        endIcon={sending ? <CircularProgress size={16} /> : <Send size={16} />}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        }}
                                    >
                                        Send Reply
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        color="text.secondary"
                        bgcolor="#fff"
                    >
                        <Box
                            sx={{
                                width: 80, height: 80,
                                borderRadius: '24px',
                                bgcolor: '#f1f5f9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                mb: 2
                            }}
                        >
                            <Send size={40} className="text-slate-400" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">No conversation selected</Typography>
                        <Typography variant="body2">Select a thread to start messaging</Typography>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast.severity} sx={{ borderRadius: '12px' }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
