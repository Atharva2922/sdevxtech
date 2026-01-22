import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Chip, Button, LinearProgress, Grid, CircularProgress, Alert } from '@mui/material';
import { FolderKanban, Clock, Download, Eye } from 'lucide-react';

interface Project {
    _id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    startDate: string;
    dueDate: string;
    team: string;
    deliverables: string[];
}

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data.projects || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Progress': return 'primary';
            case 'Review': return 'warning';
            case 'Planning': return 'info';
            case 'Completed': return 'success';
            default: return 'default';
        }
    };

    return (
        <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        My Projects
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track and manage your ongoing projects
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        borderRadius: '12px',
                    }}
                >
                    Request New Project
                </Button>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && projects.length === 0 && (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        No projects yet. Request a new project to get started!
                    </Typography>
                </Paper>
            )}

            {!loading && !error && projects.length > 0 && (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item xs={12} key={project._id}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                    <Box flex={1}>
                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {project.name}
                                            </Typography>
                                            <Chip
                                                label={project.status}
                                                size="small"
                                                color={getStatusColor(project.status) as any}
                                                sx={{ borderRadius: '6px' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            {project.description}
                                        </Typography>

                                        <Grid container spacing={2} mb={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Team
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {project.team}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Start Date
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {project.startDate}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Due Date
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {project.dueDate}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Deliverables
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {project.deliverables.length} items
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Box mb={2}>
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

                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {project.deliverables.map((item, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={item}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ borderRadius: '6px' }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Stack direction="row" spacing={1} ml={2}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Eye size={16} />}
                                            sx={{ textTransform: 'none', borderRadius: '8px' }}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Download size={16} />}
                                            sx={{ textTransform: 'none', borderRadius: '8px' }}
                                        >
                                            Files
                                        </Button>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Stack>
    );
}
