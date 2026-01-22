import { useState } from 'react';
import {
    Box, Paper, Typography, Stack, Tabs, Tab, Chip, TextField, InputAdornment,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, IconButton
} from '@mui/material';
import {
    Search, Filter, Info, AlertTriangle, AlertCircle, Clock, User, Server, Database
} from 'lucide-react';

// Mock Data
const ACTIVITY_LOGS = [
    { id: 1, type: 'info', action: 'User Login', details: 'User "John Doe" logged in successfully', user: 'John Doe', time: '2 mins ago' },
    { id: 2, type: 'warning', action: 'Failed Login Attempt', details: 'Multiple failed attempts from IP 192.168.1.1', user: 'Unknown', time: '15 mins ago' },
    { id: 3, type: 'info', action: 'Content Update', details: 'Updated "Hero Section" content', user: 'Admin', time: '1 hour ago' },
    { id: 4, type: 'error', action: 'Payment Failed', details: 'Transaction #TXN-78903 failed gateway validation', user: 'System', time: '3 hours ago' },
    { id: 5, type: 'info', action: 'User Created', details: 'New user "Sarah Wilson" registered', user: 'System', time: '5 hours ago' },
];

const SYSTEM_LOGS = [
    { id: 101, type: 'success', action: 'Backup Completed', details: 'Daily database backup finished successfully', source: 'Database', time: '02:00 AM' },
    { id: 102, type: 'error', action: 'API Error', details: '500 Internal Server Error on /api/v1/content', source: 'API Server', time: 'Yesterday' },
    { id: 103, type: 'warning', action: 'High Latency', details: 'Response time > 2s detected in region US-East', source: 'Monitoring', time: 'Yesterday' },
    { id: 104, type: 'success', action: 'System Update', details: 'System patched to v2.1.0', source: 'DevOps', time: '2 days ago' },
];

export default function LogsSection() {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'error': return <AlertCircle size={20} color="#ef4444" />;
            case 'warning': return <AlertTriangle size={20} color="#f59e0b" />;
            case 'success': return <Info size={20} color="#10b981" />; // Reusing Info for success/info generic
            default: return <Info size={20} color="#3b82f6" />;
        }
    };

    const logs = tabValue === 0 ? ACTIVITY_LOGS : SYSTEM_LOGS;

    // Filter logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'error' && log.type === 'error') ||
            (filter === 'warning' && log.type === 'warning');
        return matchesSearch && matchesFilter;
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
                            <Tab label="Activity Logs" icon={<User size={16} />} iconPosition="start" />
                            <Tab label="System Logs" icon={<Server size={16} />} iconPosition="start" />
                        </Tabs>
                    </Box>
                    <Box display="flex" gap={2} alignItems="center">
                        <Stack direction="row" spacing={1}>
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
                            <Chip
                                label="Warnings"
                                onClick={() => setFilter('warning')}
                                color={filter === 'warning' ? 'warning' : 'default'}
                                variant={filter === 'warning' ? 'filled' : 'outlined'}
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
                {filteredLogs.length > 0 ? (
                    <List sx={{ p: 0 }}>
                        {filteredLogs.map((log, index) => (
                            <Box key={log.id}>
                                <ListItem alignItems="flex-start" sx={{ p: 3, '&:hover': { bgcolor: '#f8fafc' } }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: log.type === 'error' ? '#fef2f2' : log.type === 'warning' ? '#fffbeb' : '#eff6ff' }}>
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
                                                    <Clock size={12} /> {log.time}
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
                                                        label={(log as any).user || (log as any).source}
                                                        size="small"
                                                        sx={{ borderRadius: '4px', height: 20, fontSize: '10px' }}
                                                        icon={tabValue === 0 ? <User size={10} /> : <Database size={10} />}
                                                    />
                                                    <Chip
                                                        label={log.type.toUpperCase()}
                                                        size="small"
                                                        color={log.type === 'error' ? 'error' : log.type === 'warning' ? 'warning' : 'primary'}
                                                        variant="outlined"
                                                        sx={{ borderRadius: '4px', height: 20, fontSize: '10px' }}
                                                    />
                                                </Stack>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < filteredLogs.length - 1 && <Divider variant="inset" component="li" />}
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
