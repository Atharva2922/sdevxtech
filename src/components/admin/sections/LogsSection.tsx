import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Stack, Tabs, Tab, Chip, TextField, InputAdornment,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress,
    Button
} from '@mui/material';
import {
    Search, Filter, Info, AlertTriangle, AlertCircle, Clock, User, Server, Database,
    RefreshCcw, CheckCircle
} from 'lucide-react';

interface Log {
    _id: string;
    action: string;
    details: string;
    type: 'info' | 'warning' | 'error' | 'success';
    user: string;
    source: string;
    createdAt: string;
}

export default function LogsSection() {
    const [tabValue, setTabValue] = useState(0); // 0: All, 1: Activity (User), 2: System
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filter !== 'all') params.append('type', filter);

            const res = await fetch(`/api/logs?${params.toString()}`, {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [searchTerm, filter]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        // Logic to filter by user vs system if needed, or just visual
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'error': return <AlertCircle size={20} color="#ef4444" />;
            case 'warning': return <AlertTriangle size={20} color="#f59e0b" />;
            case 'success': return <CheckCircle size={20} color="#10b981" />;
            default: return <Info size={20} color="#3b82f6" />;
        }
    };

    // Filter logs based on tabs (client-side for now, or could be API param)
    const displayLogs = logs.filter(log => {
        if (tabValue === 0) return true;
        // Simple heuristic: User actions vs System actions
        const isSystem = log.user === 'System' || log.source === 'System' || log.source === 'Database';
        if (tabValue === 1) return !isSystem; // Activity Logs
        if (tabValue === 2) return isSystem;  // System Logs
        return true;
    });

    return (
        <Stack spacing={3}>
            {/* Header & Controls */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{ '& .MuiTab-root': { textTransform: 'none', minHeight: 48 } }}
                        >
                            <Tab label="All Logs" />
                            <Tab label="Activity Logs" icon={<User size={16} />} iconPosition="start" />
                            <Tab label="System Logs" icon={<Server size={16} />} iconPosition="start" />
                        </Tabs>
                    </Box>
                    <Box display="flex" gap={2} alignItems="center">
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                startIcon={<RefreshCcw size={14} />}
                                onClick={fetchLogs}
                                sx={{ minWidth: 'auto', px: 1 }}
                            />
                            <Chip
                                label="All"
                                onClick={() => setFilter('all')}
                                color={filter === 'all' ? 'primary' : 'default'}
                                variant={filter === 'all' ? 'filled' : 'outlined'}
                                size="small"
                            />
                            <Chip
                                label="Errors"
                                onClick={() => setFilter('error')}
                                color={filter === 'error' ? 'error' : 'default'}
                                variant={filter === 'error' ? 'filled' : 'outlined'}
                                size="small"
                            />
                        </Stack>
                        <TextField
                            size="small"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={16} color="#94a3b8" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 200 }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Logs List */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', minHeight: 400 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                        <CircularProgress />
                    </Box>
                ) : displayLogs.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {displayLogs.map((log, index) => (
                            <Box key={log._id}>
                                <ListItem alignItems="flex-start" sx={{ p: 3, '&:hover': { bgcolor: '#f8fafc' } }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: log.type === 'error' ? '#fef2f2' : log.type === 'warning' ? '#fffbeb' : log.type === 'success' ? '#ecfdf5' : '#eff6ff' }}>
                                            {getIcon(log.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {log.action}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                                    <Clock size={12} /> {new Date(log.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box mt={0.5}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {log.details}
                                                </Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip
                                                        label={log.user || log.source}
                                                        size="small"
                                                        sx={{ borderRadius: '4px', height: 20, fontSize: '10px' }}
                                                        icon={tabValue === 1 ? <User size={10} /> : <Database size={10} />}
                                                    />
                                                    <Chip
                                                        label={log.type.toUpperCase()}
                                                        size="small"
                                                        color={log.type === 'error' ? 'error' : log.type === 'warning' ? 'warning' : log.type === 'success' ? 'success' : 'primary'}
                                                        variant="outlined"
                                                        sx={{ borderRadius: '4px', height: 20, fontSize: '10px' }}
                                                    />
                                                </Stack>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < displayLogs.length - 1 && <Divider variant="inset" component="li" />}
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={400} color="text.secondary">
                        <Search size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <Typography>No logs found matching your criteria</Typography>
                    </Box>
                )}
            </Paper>
        </Stack>
    );
}
