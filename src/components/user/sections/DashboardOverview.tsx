import { Box, Paper, Typography, Grid, Card, CardContent, LinearProgress, Chip, Stack, Button } from '@mui/material';
import { FolderKanban, Clock, CheckCircle, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';

export default function DashboardOverview() {
    const stats = [
        { label: 'Active Projects', value: '3', icon: FolderKanban, color: '#667eea', change: '+2 this month' },
        { label: 'Pending Tasks', value: '7', icon: Clock, color: '#f59e0b', change: '3 due soon' },
        { label: 'Completed', value: '12', icon: CheckCircle, color: '#10b981', change: '+5 this month' },
        { label: 'Messages', value: '4', icon: MessageSquare, color: '#3b82f6', change: '2 unread' },
    ];

    const recentProjects = [
        { name: 'E-commerce Website', status: 'In Progress', progress: 65, dueDate: 'Feb 15, 2026' },
        { name: 'Mobile App Design', status: 'Review', progress: 90, dueDate: 'Feb 10, 2026' },
        { name: 'SEO Optimization', status: 'Planning', progress: 25, dueDate: 'Mar 1, 2026' },
    ];

    return (
        <Stack spacing={3}>
            {/* Welcome Header */}
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome Back! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your projects today
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Box p={1.5} bgcolor={`${stat.color}15`} borderRadius="12px">
                                            <Icon size={24} color={stat.color} />
                                        </Box>
                                        <TrendingUp size={16} color="#10b981" />
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {stat.label}
                                    </Typography>
                                    <Typography variant="caption" color="success.main">
                                        {stat.change}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Recent Projects */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="bold">
                        Recent Projects
                    </Typography>
                    <Button variant="text" sx={{ textTransform: 'none' }}>
                        View All
                    </Button>
                </Box>

                <Stack spacing={2}>
                    {recentProjects.map((project, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#f8fafc' },
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {project.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Due: {project.dueDate}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={project.status}
                                    size="small"
                                    color={
                                        project.status === 'In Progress' ? 'primary' :
                                            project.status === 'Review' ? 'warning' : 'default'
                                    }
                                    sx={{ borderRadius: '6px' }}
                                />
                            </Box>
                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="caption" color="text.secondary">
                                        Progress
                                    </Typography>
                                    <Typography variant="caption" fontWeight={600}>
                                        {project.progress}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#e2e8f0',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>

            {/* Quick Actions */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                py: 2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                            }}
                        >
                            Request Service
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                py: 2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                            }}
                        >
                            Upload Files
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                py: 2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                            }}
                        >
                            Send Message
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                py: 2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                            }}
                        >
                            View Invoices
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Stack>
    );
}
