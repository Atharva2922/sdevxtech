import { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Chip, Avatar, Typography, Tooltip, Stack,
    TextField, InputAdornment, Button, Divider, CircularProgress
} from '@mui/material';
import {
    MoreVertical, Eye, Edit, Ban, Trash2, Key, Shield, Search, Filter, Plus
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users || []);
                } else {
                    console.error('Failed to fetch users', await response.text());
                }
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setLoading(false);
            }
        };

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Blocked': return 'error';
            case 'Pending': return 'warning';
            default: return 'success'; // Default to success/active for now
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
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                                                    {user.name.charAt(0)}
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
                <MenuItem onClick={handleMenuClose}>
                    <Eye size={16} style={{ marginRight: 12 }} /> View Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Edit size={16} style={{ marginRight: 12 }} /> Edit User
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Key size={16} style={{ marginRight: 12 }} /> Reset Password
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Shield size={16} style={{ marginRight: 12 }} /> Change Role
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: 'warning.main' }}>
                    <Ban size={16} style={{ marginRight: 12 }} /> Block User
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                    <Trash2 size={16} style={{ marginRight: 12 }} /> Delete User
                </MenuItem>
            </Menu>
        </Stack>
    );
}
