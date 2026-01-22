import { useState } from 'react';
import {
    Box, Paper, Typography, Stack, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, MenuItem
} from '@mui/material';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function ProjectsManagementSection() {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'E-commerce Website Redesign',
            client: 'John Doe',
            status: 'In Progress',
            progress: 65,
            dueDate: '2026-02-15',
            team: 'Design Team A',
        },
        {
            id: 2,
            name: 'Mobile App Development',
            client: 'Sarah Wilson',
            status: 'Review',
            progress: 90,
            dueDate: '2026-02-10',
            team: 'Dev Team B',
        },
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);

    const handleAddProject = () => {
        setEditingProject(null);
        setOpenDialog(true);
    };

    const handleEditProject = (project: any) => {
        setEditingProject(project);
        setOpenDialog(true);
    };

    const handleDeleteProject = (id: number) => {
        setProjects(projects.filter(p => p.id !== id));
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
                                <TableRow key={project.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {project.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{project.client}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={project.status}
                                            size="small"
                                            color={getStatusColor(project.status) as any}
                                            sx={{ borderRadius: '6px' }}
                                        />
                                    </TableCell>
                                    <TableCell>{project.progress}%</TableCell>
                                    <TableCell>{project.dueDate}</TableCell>
                                    <TableCell>{project.team}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton size="small" onClick={() => handleEditProject(project)}>
                                                <Edit size={16} />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteProject(project.id)}>
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                defaultValue={editingProject?.name}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Client Name"
                                defaultValue={editingProject?.client}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                defaultValue={editingProject?.status || 'Planning'}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            >
                                <MenuItem value="Planning">Planning</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Review">Review</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Progress (%)"
                                defaultValue={editingProject?.progress || 0}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Due Date"
                                defaultValue={editingProject?.dueDate}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Team"
                                defaultValue={editingProject?.team}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenDialog(false)}
                        sx={{
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        {editingProject ? 'Update' : 'Create'} Project
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
