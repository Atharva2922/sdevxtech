import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Stack, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Project {
    _id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: any; // Populated user object or ID
    clientName?: string; // Derived for display
    status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
    progress: number;
    dueDate: string;
    team: string;
    description: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
}

export default function ProjectsManagementSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        status: 'Planning',
        progress: 0,
        dueDate: '',
        team: '',
        description: ''
    });

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            } else {
                console.error('Failed to fetch projects', await res.text());
                setToast({ open: true, message: 'Failed to fetch projects', severity: 'error' });
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setToast({ open: true, message: 'Error fetching projects', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            } else {
                console.error('Failed to fetch users', await res.text());
                setToast({ open: true, message: 'Failed to fetch clients list', severity: 'error' });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setToast({ open: true, message: 'Error fetching clients', severity: 'error' });
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const handleAddProject = () => {
        setEditingProject(null);
        setFormData({
            name: '',
            userId: '',
            status: 'Planning',
            progress: 0,
            dueDate: new Date().toISOString().split('T')[0],
            team: '',
            description: ''
        });
        setOpenDialog(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            userId: typeof project.userId === 'object' ? project.userId._id : project.userId,
            status: project.status,
            progress: project.progress,
            dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
            team: project.team,
            description: project.description
        });
        setOpenDialog(true);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setToast({ open: true, message: 'Project deleted successfully', severity: 'success' });
                setProjects(projects.filter(p => p._id !== id));
            } else {
                setToast({ open: true, message: 'Failed to delete project', severity: 'error' });
            }
        } catch (error) {
            setToast({ open: true, message: 'Error deleting project', severity: 'error' });
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.userId || !formData.dueDate) {
            setToast({ open: true, message: 'Please fill in all required fields', severity: 'error' });
            return;
        }

        setActionLoading(true);
        try {
            const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
            const method = editingProject ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (res.ok) {
                setToast({ open: true, message: `Project ${editingProject ? 'updated' : 'created'} successfully`, severity: 'success' });
                setOpenDialog(false);
                fetchProjects();
            } else {
                const error = await res.json();
                setToast({ open: true, message: error.error || 'Operation failed', severity: 'error' });
            }
        } catch (error) {
            setToast({ open: true, message: 'An error occurred', severity: 'error' });
        } finally {
            setActionLoading(false);
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
                        Projects Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage client projects displayed in user dashboards
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={handleAddProject}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        borderRadius: '12px',
                    }}
                >
                    Add Project
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Team</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project._id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {project.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {typeof project.userId === 'object' ? project.userId?.name : 'Unknown User'}
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {typeof project.userId === 'object' ? project.userId?.email : ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={project.status}
                                                size="small"
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                color={getStatusColor(project.status) as any}
                                                sx={{ borderRadius: '6px' }}
                                            />
                                        </TableCell>
                                        <TableCell>{project.progress}%</TableCell>
                                        <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{project.team}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton size="small" onClick={() => handleEditProject(project)}>
                                                    <Edit size={16} />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteProject(project._id)}>
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {projects.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            No projects found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Client"
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    No clients found
                                </MenuItem>
                            )}
                        </TextField>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={formData.status}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            >
                                <MenuItem value="Planning">Planning</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Review">Review</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                type="number"
                                label="Progress (%)"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                                inputProps={{ min: 0, max: 100 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Due Date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Team"
                                value={formData.team}
                                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={actionLoading}
                        sx={{
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        {actionLoading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
