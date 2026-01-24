import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Chip, Button, LinearProgress, Grid, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { FolderKanban, Clock, Download, Eye, Plus } from 'lucide-react';

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

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
        type: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/projects', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            setProjects(data.projects || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestProject = async () => {
        if (!formData.name || !formData.description || !formData.dueDate) {
            alert('Please fill in all required fields');
            return;
        }

        setRequestLoading(true);
        try {
            const res = await fetch('/api/user/projects/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to request project');
            }

            // Refresh projects
            await fetchProjects();
            setOpenDialog(false);
            setFormData({ name: '', description: '', dueDate: '', type: '' });
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to request project');
        } finally {
            setRequestLoading(false);
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
                    startIcon={<Plus size={18} />}
                    onClick={() => setOpenDialog(true)}
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
                        <Grid size={{ xs: 12 }} key={project._id}>
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
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                color={getStatusColor(project.status) as any}
                                                sx={{ borderRadius: '6px' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            {project.description}
                                        </Typography>

                                        <Grid container spacing={2} mb={2}>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Team
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {project.team}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Start Date
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {new Date(project.startDate).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Due Date
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {new Date(project.dueDate).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

            {/* Application Request Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: { borderRadius: '16px', maxWidth: 500, width: '100%' }
                }}
            >
                <DialogTitle fontWeight="bold">Request New Project</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Project Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Project Type"
                            fullWidth
                            placeholder="e.g. Web Development, Mobile App"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="Target Due Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleRequestProject}
                        disabled={requestLoading}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            borderRadius: '8px',
                        }}
                    >
                        {requestLoading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
