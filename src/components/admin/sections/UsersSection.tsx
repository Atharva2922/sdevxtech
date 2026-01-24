'use client';

import { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Chip, Avatar, Typography, Tooltip, Stack,
    TextField, InputAdornment, Button, Divider, CircularProgress, Dialog,
    DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, Snackbar, Alert
} from '@mui/material';
import {
    MoreVertical, Eye, Edit, Ban, Trash2, Key, Shield, Search, Filter, Plus, CheckCircle
} from 'lucide-react';

interface User {
    _id: string; // MongoDB ID
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
    // UI only fields (optional or derived)
    phone?: string;
    status?: string;
    avatar?: string;
}

export default function UsersSection() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Action States
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // New User Form State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        phone: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            } else {
                if (response.status === 403) {
                    setToast({ open: true, message: 'Access Denied: You need admin privileges to view users.', severity: 'error' });
                } else {
                    console.error('Failed to fetch users', await response.text());
                    setToast({ open: true, message: 'Failed to fetch users', severity: 'error' });
                }
            }
        } catch (error: unknown) {
            console.error('Error loading users:', error);
            setToast({ open: true, message: 'Error loading users list', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    // API Actions
    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            setToast({ open: true, message: 'Please fill in all required fields', severity: 'error' });
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
                credentials: 'include'
            });

            if (res.ok) {
                setToast({ open: true, message: 'User created successfully', severity: 'success' });
                setOpenAddDialog(false);
                setNewUser({ name: '', email: '', password: '', role: 'user', phone: '' });
                fetchUsers();
            } else {
                const error = await res.json();
                setToast({ open: true, message: error.error || 'Failed to create user', severity: 'error' });
            }
        } catch (error: unknown) {
            setToast({ open: true, message: 'Error creating user', severity: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateUserStatus = async (status: string) => {
        if (!selectedUser) return;
        handleMenuClose();

        // Optimistic update
        const updatedUsers = users.map(u =>
            u._id === selectedUser._id ? { ...u, status } : u
        );
        setUsers(updatedUsers);

        try {
            const res = await fetch(`/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            if (!res.ok) {
                const error = await res.json();
                setToast({ open: true, message: error.error || 'Failed to update status', severity: 'error' });
                fetchUsers(); // Revert
            } else {
                setToast({ open: true, message: `User ${status === 'Blocked' ? 'blocked' : 'activated'}`, severity: 'success' });
            }
        } catch (error: unknown) {
            setToast({ open: true, message: 'Error updating user', severity: 'error' });
            fetchUsers();
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        handleMenuClose();

        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/users/${selectedUser._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                setToast({ open: true, message: 'User deleted successfully', severity: 'success' });
                setUsers(users.filter(u => u._id !== selectedUser._id));
            } else {
                const error = await res.json();
                setToast({ open: true, message: error.error || 'Failed to delete user', severity: 'error' });
            }
        } catch (error: unknown) {
            setToast({ open: true, message: 'Error deleting user', severity: 'error' });
        }
    };

    const handleChangeRole = async () => {
        if (!selectedUser) return;
        handleMenuClose();

        const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';

        try {
            const res = await fetch(`/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
                credentials: 'include'
            });

            if (res.ok) {
                setToast({ open: true, message: `Role updated to ${newRole}`, severity: 'success' });
                fetchUsers();
            } else {
                const error = await res.json();
                setToast({ open: true, message: error.error || 'Failed to update role', severity: 'error' });
            }
        } catch (error: unknown) {
            setToast({ open: true, message: 'Error updating role', severity: 'error' });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Blocked': return 'error';
            case 'Pending': return 'warning';
            default: return 'success';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'primary.main';
            case 'user': return 'text.secondary';
            default: return 'text.secondary';
        }
    };

    // Filter users
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Stack spacing={3}>
            {/* Toolbar */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} color="#94a3b8" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: '100%', sm: 300 } }}
                    />
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<Filter size={18} />}
                            sx={{ borderColor: '#e2e8f0', color: 'text.secondary', textTransform: 'none' }}
                        >
                            Filters
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={18} />}
                            onClick={() => setOpenAddDialog(true)}
                            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: '8px' }}
                        >
                            Add User
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Users Table */}
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
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Contact</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Created</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar src={user.avatar} alt={user.name}>
                                                    {user.name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {user.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {user._id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{user.email}</Typography>
                                            <Typography variant="caption" color="text.secondary">{user.phone || 'N/A'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Shield size={14} color={user.role === 'admin' ? '#6366f1' : '#94a3b8'} />
                                                <Typography variant="body2" fontWeight={500} color={getRoleColor(user.role)}>
                                                    {user.role}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status || 'Active'}
                                                size="small"
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                color={getStatusColor(user.status || 'Active') as any}
                                                variant="outlined"
                                                sx={{ fontWeight: 500, borderRadius: '6px' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            <Typography color="text.secondary">No users found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Paper>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: '12px', minWidth: 180, mt: 1 }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleChangeRole}>
                    <Shield size={16} style={{ marginRight: 12 }} />
                    {selectedUser?.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                </MenuItem>
                <Divider />
                {selectedUser?.status !== 'Blocked' ? (
                    <MenuItem onClick={() => handleUpdateUserStatus('Blocked')} sx={{ color: 'warning.main' }}>
                        <Ban size={16} style={{ marginRight: 12 }} /> Block User
                    </MenuItem>
                ) : (
                    <MenuItem onClick={() => handleUpdateUserStatus('Active')} sx={{ color: 'success.main' }}>
                        <CheckCircle size={16} style={{ marginRight: 12 }} /> Activate User
                    </MenuItem>
                )}
                <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
                    <Trash2 size={16} style={{ marginRight: 12 }} /> Delete User
                </MenuItem>
            </Menu>

            {/* Add User Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Phone (Optional)"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAddDialog(false)} disabled={actionLoading}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddUser}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Creating...' : 'Create User'}
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
