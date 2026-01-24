import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Stack, Grid, Card, CardContent, Button, Divider, LinearProgress, CircularProgress
} from '@mui/material';
import {
    Download, FileText, FileSpreadsheet, TrendingUp, Users, Activity, ExternalLink
} from 'lucide-react';

export default function AnalyticsSection() {
    const [exporting, setExporting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics', { credentials: 'include' });
            if (res.ok) {
                const fetchedData = await res.json();
                setData(fetchedData);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleExport = (type: string) => {
        setExporting(true);
        // Simulate export delay
        setTimeout(() => {
            alert(`Exporting ${type} report...`);
            setExporting(false);
        }, 1000);
    };

    // calculate total feature usage from project breakdown (example mapping)
    const getProjectBreakdown = () => {
        if (!data?.projects?.breakdown) return [];
        const total = data.projects.total || 1;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.projects.breakdown.map((b: any) => ({
            label: b._id,
            value: Math.round((b.count / total) * 100),
            count: b.count,
            color: b._id === 'Completed' ? '#10b981' : b._id === 'In Progress' ? '#3b82f6' : '#f59e0b'
        }));
    };

    if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

    const projectStats = getProjectBreakdown();

    return (
        <Stack spacing={4}>
            {/* Header & Export */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Analytics Overview</Typography>
                        <Typography variant="body2" color="text.secondary">Real-time usage and revenue reports</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<FileText size={16} />}
                            onClick={() => handleExport('PDF')}
                            disabled={exporting}
                            sx={{ color: 'text.secondary', borderColor: '#e2e8f0', textTransform: 'none' }}
                        >
                            PDF
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<FileSpreadsheet size={16} />}
                            onClick={() => handleExport('CSV')}
                            disabled={exporting}
                            sx={{ color: 'text.secondary', borderColor: '#e2e8f0', textTransform: 'none' }}
                        >
                            Excel
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Growth & Revenue Components */}
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr' }} gap={3}>
                {/* User Growth (Line Chart Simulation) */}
                <Box>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box p={1} bgcolor="#eff6ff" borderRadius="8px">
                                    <TrendingUp size={20} color="#3b82f6" />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600}>User Growth</Typography>
                            </Box>
                            <Box display="flex" gap={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box width={8} height={8} borderRadius="50%" bgcolor="#3b82f6" />
                                    <Typography variant="caption">New Users ({data?.users?.total || 0})</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Custom CSS Chart Placeholder - using real growth data if available, else placeholder */}
                        <Box height={300} display="flex" alignItems="flex-end" justifyContent="space-between" gap={1} sx={{ opacity: 0.9 }}>
                            {/* Map growth data or fallback to 0. Ideally verify buckets match month names. */}
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                                // Find bucket for this month (simplified logic)
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const count = data?.users?.growth?.find((g: any) => g._id === i + 1)?.count || 0;
                                // Scale height: assume max 10 users for visual scaling for now
                                const height = Math.min((count / 10) * 200 + 20, 250);
                                return (
                                    <Box key={i} width="100%" display="flex" flexDirection="column" gap={0.5}>
                                        <Box
                                            sx={{
                                                height: `${height}px`,
                                                bgcolor: i === 5 ? '#3b82f6' : '#bfdbfe',
                                                borderRadius: '4px',
                                                transition: 'height 1s',
                                                '&:hover': { bgcolor: '#2563eb' }
                                            }}
                                        />
                                        <Typography variant="caption" align="center" color="text.secondary">
                                            {month}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Paper>
                </Box>

                {/* Feature Usage (Stats Simulation) */}
                <Box>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={4}>
                            <Box p={1} bgcolor="#ecfdf5" borderRadius="8px">
                                <Activity size={20} color="#10b981" />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>Project Status</Typography>
                        </Box>

                        <Stack spacing={4}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {projectStats.length > 0 ? projectStats.map((item: any, i: number) => (
                                <Box key={i}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2" fontWeight={500}>{item.label}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{item.count} ({item.value}%)</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.value}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: `${item.color}20`,
                                            '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 4 }
                                        }}
                                    />
                                </Box>
                            )) : (
                                <Typography color="text.secondary">No project data available</Typography>
                            )}
                        </Stack>
                    </Paper>
                </Box>

                {/* Top Active Users */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box p={1} bgcolor="#fff7ed" borderRadius="8px">
                                    <Users size={20} color="#f97316" />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600}>Most Active Users</Typography>
                            </Box>
                            <Button size="small" endIcon={<ExternalLink size={14} />} sx={{ textTransform: 'none' }}>
                                View All
                            </Button>
                        </Box>

                        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={2}>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {data?.logs?.activeUsers?.map((user: any, i: number) => (
                                <Card key={i} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                                    <CardContent sx={{ p: '16px !important' }}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Box
                                                width={40} height={40}
                                                borderRadius="50%"
                                                bgcolor={`hsl(${i * 50}, 70%, 50%)`}
                                                color="white"
                                                display="flex" alignItems="center" justifyContent="center"
                                                fontWeight="bold"
                                            >
                                                {user.name.charAt(0)}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.visits} visits<br />
                                                    Last: {new Date(user.lastActive).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!data?.logs?.activeUsers || data.logs.activeUsers.length === 0) && (
                                <Typography color="text.secondary">No active users found recently.</Typography>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Stack>
    );
}
