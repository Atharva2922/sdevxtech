import { useState } from 'react';
import {
    Box, Paper, Typography, Stack, Grid, Card, CardContent, Button, Divider, LinearProgress
} from '@mui/material';
import {
    Download, FileText, FileSpreadsheet, TrendingUp, Users, Activity, ExternalLink
} from 'lucide-react';

export default function AnalyticsSection() {
    const [exporting, setExporting] = useState(false);

    const handleExport = (type: string) => {
        setExporting(true);
        // Simulate export delay
        setTimeout(() => {
            alert(`Exporting ${type} report...`);
            setExporting(false);
        }, 1000);
    };

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
            <Grid container spacing={3}>
                {/* User Growth (Line Chart Simulation) */}
                <Grid item xs={12} md={8}>
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
                                    <Typography variant="caption">New Users</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box width={8} height={8} borderRadius="50%" bgcolor="#e2e8f0" />
                                    <Typography variant="caption">Active Users</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Custom CSS Chart Placeholder */}
                        <Box height={300} display="flex" alignItems="flex-end" justifyContent="space-between" gap={1} sx={{ opacity: 0.9 }}>
                            {[40, 65, 50, 80, 70, 90, 85, 100, 95, 110, 105, 130].map((h, i) => (
                                <Box key={i} width="100%" display="flex" flexDirection="column" gap={0.5}>
                                    <Box
                                        sx={{
                                            height: `${h * 1.5}px`,
                                            bgcolor: i === 11 ? '#3b82f6' : '#bfdbfe',
                                            borderRadius: '4px',
                                            transition: 'height 1s',
                                            '&:hover': { bgcolor: '#2563eb' }
                                        }}
                                    />
                                    <Typography variant="caption" align="center" color="text.secondary">
                                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Feature Usage (Stats Simulation) */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={4}>
                            <Box p={1} bgcolor="#ecfdf5" borderRadius="8px">
                                <Activity size={20} color="#10b981" />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>Most Used Features</Typography>
                        </Box>

                        <Stack spacing={4}>
                            {[
                                { label: 'Content Editor', value: 85, color: '#10b981' },
                                { label: 'User Management', value: 60, color: '#f59e0b' },
                                { label: 'Transactions', value: 45, color: '#6366f1' },
                                { label: 'Settings', value: 20, color: '#64748b' },
                            ].map((item, i) => (
                                <Box key={i}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2" fontWeight={500}>{item.label}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{item.value}%</Typography>
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
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Top Active Users */}
                <Grid item xs={12}>
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

                        <Grid container spacing={2}>
                            {[
                                { name: 'John Doe', role: 'Premium', visits: '1.2k', p: 95 },
                                { name: 'Sarah Wilson', role: 'Business', visits: '940', p: 82 },
                                { name: 'Mike Ross', role: 'Basic', visits: '850', p: 70 },
                                { name: 'Rachel Z', role: 'Premium', visits: '720', p: 55 },
                            ].map((user, i) => (
                                <Grid item key={i} xs={12} sm={6} md={3}>
                                    <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
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
                                                    <Typography variant="caption" color="text.secondary">{user.role} • {user.visits} visits</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
}
