'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, LinearProgress, Chip, Stack, Button, CircularProgress } from '@mui/material';
import { FolderKanban, Clock, CheckCircle, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';

interface DashboardOverviewProps {
    onNavigate?: Dispatch<SetStateAction<string>>;
    user?: any; // Accepting user prop
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, user }) => {
    // Check if profile is incomplete (default name or placeholder email)
    const isProfileIncomplete = user && (String(user.name).startsWith('User ') || String(user.email).endsWith('@phone.firebase'));

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
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                    Welcome Back! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    Here&apos;s what&apos;s happening with your projects today
                </Typography>
            </Box>

            {/* Profile Completion Banner */}
            {isProfileIncomplete && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #FFF4E5 0%, #FFF9F0 100%)', // Subtle orange/warm background
                        border: '1px solid #FED7AA',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2
                    }}
                >
                    <Box display="flex" gap={2} alignItems="flex-start">
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                bgcolor: '#FFEDD5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            <AlertCircle color="#F97316" size={24} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" color="#9A3412" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                Complete your profile
                            </Typography>
                            <Typography variant="body2" color="#C2410C">
                                Add your name and email to personalize your experience.
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => onNavigate?.('profile')}
                        fullWidth={false}
                        sx={{
                            bgcolor: '#F97316',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '50px',
                            px: 3,
                            width: { xs: '100%', md: 'auto' }, // Full width button on mobile
                            boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)',
                            '&:hover': {
                                bgcolor: '#EA580C',
                                boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
                            }
                        }}
                    >
                        Complete Profile
                    </Button>
                </Paper>
            )}

            {/* Stats Cards */}
            <Grid container spacing={2}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                                <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } } }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Box p={1.5} bgcolor={`${stat.color}15`} borderRadius="12px">
                                            <Icon size={24} color={stat.color} />
                                        </Box>
                                        <TrendingUp size={16} color="#10b981" />
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
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
