'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, LinearProgress, Chip, Stack, Button, CircularProgress } from '@mui/material';
import { FolderKanban, Clock, CheckCircle, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';

interface DashboardOverviewProps {
    onNavigate?: Dispatch<SetStateAction<string>>;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stats, setStats] = useState<any[]>([
        { label: 'Active Projects', value: '-', icon: FolderKanban, color: '#667eea', change: 'Loading...' },
        { label: 'Pending Tasks', value: '-', icon: Clock, color: '#f59e0b', change: 'Loading...' },
        { label: 'Completed', value: '-', icon: CheckCircle, color: '#10b981', change: 'Loading...' },
        { label: 'Messages', value: '-', icon: MessageSquare, color: '#3b82f6', change: 'Loading...' },
    ]);
    const [loading, setLoading] = useState(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentProjects, setRecentProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('/api/user/stats');
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    if (data.stats) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const enhancedStats = data.stats.map((s: any) => ({
                            ...s,
                            icon: getIcon(s.label)
                        }));
                        setStats(enhancedStats);
                    }
                }

                // Fetch Recent Projects
                const projectsRes = await fetch('/api/user/projects');
                if (projectsRes.ok) {
                    const data = await projectsRes.json();
                    if (data.projects) {
                        setRecentProjects(data.projects.slice(0, 3));
                    }
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getIcon = (label: string) => {
        switch (label) {
            case 'Active Projects': return FolderKanban;
            case 'Pending Tasks': return Clock;
            case 'Completed': return CheckCircle;
            default: return MessageSquare;
        }
    };

    return (
        <Stack spacing={3}>
            {/* Welcome Header */}
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome Back! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here&apos;s what&apos;s happening with your projects today
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                    <Button
                        variant="text"
                        sx={{ textTransform: 'none' }}
                        onClick={() => onNavigate?.('projects')}
                    >
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
                    {recentProjects.length === 0 && (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                            No projects found.
                        </Typography>
                    )}
                </Stack>
            </Paper>

            {/* Quick Actions */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => onNavigate?.('services')}
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => onNavigate?.('documents')}
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => onNavigate?.('messages')}
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => onNavigate?.('settings')}
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
};

export default DashboardOverview;
