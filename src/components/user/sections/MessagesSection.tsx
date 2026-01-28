import { useState, useEffect, useMemo } from 'react';
import {
    Box, Paper, Typography, Stack, Avatar, Button, IconButton,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, CircularProgress, useMediaQuery, useTheme
} from '@mui/material';
import { Search, Send, ArrowLeft, Check, Plus, MoreVertical } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    image: string;
}

interface Message {
    _id: string;
    from: string; // 'user' or 'admin' (or implicit from data)
    fromUserId: User;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface Thread {
    id: string; // use subject as ID
    subject: string;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
    participants: User[];
}

export default function MessagesSection() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedThreadSubject, setSelectedThreadSubject] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Send/Reply State
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    // Group by Subject to simulate threads
    const threads = useMemo(() => {
        const threadMap = new Map<string, Thread>();

        messages.forEach(msg => {
            // Normalize subject by removing all "Re:" prefixes recursively
            const normalizedSubject = msg.subject.replace(/^(Re:\s*)+/i, '').trim() || 'No Subject';

            if (!threadMap.has(normalizedSubject)) {
                threadMap.set(normalizedSubject, {
                    id: normalizedSubject,
                    subject: normalizedSubject,
                    messages: [],
                    lastMessage: msg,
                    unreadCount: 0,
                    participants: []
                });
            }

            const thread = threadMap.get(normalizedSubject)!;
            thread.messages.push(msg);

            // Track participants (simplified)
            if (msg.fromUserId && !thread.participants.find(p => p._id === msg.fromUserId._id)) {
                thread.participants.push(msg.fromUserId);
            }

            // Update stats
            if (!msg.isRead && msg.from !== 'user') thread.unreadCount++;

            if (new Date(msg.createdAt) > new Date(thread.lastMessage.createdAt)) {
                thread.lastMessage = msg;
            }
        });

        return Array.from(threadMap.values()).sort((a, b) =>
            new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
        ).filter(t => t.subject.toLowerCase().includes(search.toLowerCase()));
    }, [messages, search]);

    const activeThread = threads.find(t => t.subject === selectedThreadSubject);

    const handleSendMessage = async (isReply: boolean = false) => {
        let subject = newSubject;
        let messageRaw = newMessage;

        if (isReply) {
            // Ensure we don't double-add "Re:"
            const baseSubject = activeThread ? activeThread.subject : '';
            subject = baseSubject.startsWith('Re:') ? baseSubject : `Re: ${baseSubject}`;
            messageRaw = replyText;
        }

        if (!subject || !messageRaw.trim()) return;

        setSending(true);
        try {
            const res = await fetch('/api/user/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message: messageRaw })
            });

            if (!res.ok) throw new Error('Failed to send message');

            await fetchMessages();

            if (isReply) {
                setReplyText('');
            } else {
                setOpenNewDialog(false);
                setNewSubject('');
                setNewMessage('');
                // Select the new thread
                setSelectedThreadSubject(subject);
            }
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to send');
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
                    width: { xs: '100%', md: '320px', lg: '350px' },
                    borderRight: '1px solid #f1f5f9',
                    display: isMobile && selectedThreadSubject ? 'none' : 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fafafa'
                }}
            >
                <Box p={2} borderBottom="1px solid #f1f5f9" bgcolor="#fff">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">Inbox</Typography>
                        <Button
                            startIcon={<Plus size={18} />}
                            variant="contained"
                            size="small"
                            onClick={() => setOpenNewDialog(true)}
                            sx={{ borderRadius: '8px', textTransform: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            Compose
                        </Button>
                    </Box>
                    <TextField
                        placeholder="Search conversations..."
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <Search size={18} className="text-gray-400 mr-2" />,
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', borderRadius: '10px' } }}
                    />
                </Box>

                <Stack sx={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}><CircularProgress size={24} /></Box>
                    ) : threads.length === 0 ? (
                        <Box p={4} textAlign="center" color="text.secondary">No conversations yet.</Box>
                    ) : (
                        threads.map(thread => (
                            <Box
                                key={thread.id}
                                onClick={() => setSelectedThreadSubject(thread.subject)}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f8fafc',
                                    bgcolor: selectedThreadSubject === thread.subject ? '#eef2ff' : 'transparent',
                                    '&:hover': { bgcolor: selectedThreadSubject === thread.subject ? '#eef2ff' : '#f8fafc' },
                                    display: 'flex',
                                    gap: 2,
                                    position: 'relative'
                                }}
                            >
                                {thread.unreadCount > 0 && (
                                    <Box sx={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: 4, height: 40, bgcolor: 'primary.main', borderRadius: '4px' }} />
                                )}
                                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                                    {thread.subject[0].toUpperCase()}
                                </Avatar>
                                <Box flex={1} minWidth={0}>
                                    <Box display="flex" justifyContent="space-between" alignItems="baseline">
                                        <Typography variant="subtitle2" fontWeight={thread.unreadCount > 0 ? 700 : 600} noWrap>
                                            {thread.subject}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                                            {formatTimeShort(thread.lastMessage.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {thread.participants.map(p => p.name).join(', ') || 'System'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.5 }}>
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
                    display: isMobile && !selectedThreadSubject ? 'none' : 'flex',
                    flexDirection: 'column',
                    bgcolor: '#fff',
                    position: 'relative'
                }}
            >
                {activeThread ? (
                    <>
                        <Box p={2} borderBottom="1px solid #f1f5f9" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#fff">
                            <Box display="flex" alignItems="center" gap={2}>
                                {isMobile && (
                                    <IconButton onClick={() => setSelectedThreadSubject(null)} size="small">
                                        <ArrowLeft size={20} />
                                    </IconButton>
                                )}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {activeThread.subject}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {activeThread.participants.length} participants
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton size="small"><MoreVertical size={18} /></IconButton>
                        </Box>

                        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc' }}>
                            <Stack spacing={3}>
                                {activeThread.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(msg => (
                                    <Box
                                        key={msg._id}
                                        display="flex"
                                        gap={2}
                                        flexDirection={msg.from === 'user' || (msg.fromUserId && msg.fromUserId.name === 'You') ? 'row-reverse' : 'row'}
                                    >
                                        <Avatar
                                            src={msg.fromUserId?.image}
                                            sx={{ width: 32, height: 32, mt: 0.5 }}
                                        >
                                            {msg.fromUserId?.name?.[0]}
                                        </Avatar>
                                        <Box maxWidth="70%">
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '16px',
                                                    borderRadiusTopRight: msg.from === 'user' ? '4px' : '16px',
                                                    borderRadiusTopLeft: msg.from === 'user' ? '16px' : '4px',
                                                    bgcolor: msg.from === 'user' ? 'primary.main' : '#fff',
                                                    color: msg.from === 'user' ? '#fff' : 'text.primary',
                                                    border: msg.from === 'user' ? 'none' : '1px solid #e2e8f0'
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                    {msg.message}
                                                </Typography>
                                            </Paper>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                align={msg.from === 'user' ? 'right' : 'left'}
                                                sx={{ display: 'block', mt: 0.5, px: 1 }}
                                            >
                                                {formatTimeShort(msg.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        <Box p={2} borderTop="1px solid #f1f5f9" bgcolor="#fff">
                            <Box
                                sx={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    p: 1,
                                    '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)' }
                                }}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Type your reply..."
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
                                        onClick={() => handleSendMessage(true)}
                                        endIcon={sending ? <CircularProgress size={16} /> : <Send size={16} />}
                                        sx={{ borderRadius: '8px', textTransform: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    >
                                        Send
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" color="text.secondary">
                        <Box sx={{ width: 80, height: 80, borderRadius: '24px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Send size={40} className="text-slate-400" />
                        </Box>
                        <Typography variant="h6" fontWeight="bold">Select a conversation</Typography>
                        <Typography variant="body2">Or start a new one to contact support.</Typography>
                    </Box>
                )}
            </Box>

            <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} PaperProps={{ sx: { borderRadius: '16px', maxWidth: 500, width: '100%' } }}>
                <DialogTitle fontWeight="bold">New Message</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField label="Subject" fullWidth value={newSubject} onChange={(e) => setNewSubject(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                        <TextField label="Message" fullWidth multiline rows={4} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenNewDialog(false)} sx={{ borderRadius: '8px' }}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleSendMessage(false)} disabled={sending} sx={{ borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {sending ? 'Sending...' : 'Send Message'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
