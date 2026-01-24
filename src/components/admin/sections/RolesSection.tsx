import { useState } from 'react';
import {
    Box, Paper, Typography, Stack, Switch, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button, List, ListItem,
    ListItemText, ListItemButton, Divider
} from '@mui/material';
import {
    Shield, Users, Save, CheckCircle, AlertTriangle
} from 'lucide-react';

const ROLES = [
    { id: 'super_admin', label: 'Super Admin', color: 'error', description: 'Full system access' },
    { id: 'admin', label: 'Admin', color: 'primary', description: 'Manage content and users' },
    { id: 'moderator', label: 'Moderator', color: 'warning', description: 'Review and approve content' },
    { id: 'support', label: 'Support', color: 'info', description: 'View only access' },
];

const MODULES = [
    { id: 'users', label: 'User Management' },
    { id: 'content', label: 'Content / Data' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'settings', label: 'System Settings' },
];

const INITIAL_PERMISSIONS = {
    super_admin: { users: ['read', 'write', 'delete'], content: ['read', 'write', 'delete'], transactions: ['read', 'write', 'delete'], settings: ['read', 'write', 'delete'] },
    admin: { users: ['read', 'write', 'delete'], content: ['read', 'write', 'delete'], transactions: ['read', 'write'], settings: ['read'] },
    moderator: { users: ['read'], content: ['read', 'write'], transactions: [], settings: [] },
    support: { users: ['read'], content: ['read'], transactions: ['read'], settings: [] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

export default function RolesSection() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
    const [saving, setSaving] = useState(false);

    const handlePermissionToggle = (moduleIdx: string, type: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPermissions((prev: any) => {
            const rolePerms = prev[selectedRole] || {};
            const modulePerms = rolePerms[moduleIdx] || [];

            let newModulePerms;
            if (modulePerms.includes(type)) {
                newModulePerms = modulePerms.filter((p: string) => p !== type);
            } else {
                newModulePerms = [...modulePerms, type];
            }

            return {
                ...prev,
                [selectedRole]: {
                    ...rolePerms,
                    [moduleIdx]: newModulePerms
                }
            };
        });
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    const currentRole = ROLES.find(r => r.id === selectedRole);

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Roles & Permissions</Typography>
                        <Typography variant="body2" color="text.secondary">Manage system access levels</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CheckCircle size={18} /> : <Save size={18} />}
                        onClick={handleSave}
                        disabled={saving}
                        sx={{ bgcolor: saving ? 'success.main' : 'primary.main', textTransform: 'none' }}
                    >
                        {saving ? 'Saved Changes' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '280px 1fr' }} gap={3}>
                {/* Roles List Sidebar */}
                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: 'fit-content' }}>
                    <Box p={2} bgcolor="#f8fafc" borderBottom="1px solid #e2e8f0">
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">AVAILABLE ROLES</Typography>
                    </Box>
                    <List sx={{ p: 0 }}>
                        {ROLES.map((role) => (
                            <div key={role.id}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedRole === role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        sx={{
                                            p: 2,
                                            '&.Mui-selected': { bgcolor: `${role.color}.50`, borderLeft: `4px solid`, borderColor: `${role.color}.main` }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                                    <Typography fontWeight={selectedRole === role.id ? 600 : 500}>{role.label}</Typography>
                                                    {role.id === 'super_admin' && <Shield size={14} color="#ef4444" />}
                                                </Box>
                                            }
                                            secondary={role.description}
                                            secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <Divider component="li" />
                            </div>
                        ))}
                    </List>
                    <Box p={2}>
                        <Button fullWidth variant="outlined" startIcon={<Users size={16} />} sx={{ textTransform: 'none' }}>
                            Add New Role
                        </Button>
                    </Box>
                </Paper>

                {/* Permissions Matrix */}
                <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <Box p={3} borderBottom="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6" fontWeight="bold">Permissions for {currentRole?.label}</Typography>
                            <Chip
                                label={currentRole?.id.toUpperCase().replace('_', ' ')}
                                size="small"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                color={currentRole?.color as any}
                                variant="outlined"
                                sx={{ borderRadius: '6px', fontWeight: 600 }}
                            />
                        </Box>
                        {selectedRole === 'super_admin' && (
                            <Box display="flex" alignItems="center" gap={1} color="warning.main" bgcolor="#fff7ed" p={1} borderRadius="8px">
                                <AlertTriangle size={16} />
                                <Typography variant="caption" fontWeight={600}>Super Admin has full access by default</Typography>
                            </Box>
                        )}
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Module Access</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', width: 100 }}>Read</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', width: 100 }}>Write</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary', width: 100 }}>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {MODULES.map((module) => {
                                    const rolePerms = permissions[selectedRole]?.[module.id] || [];
                                    const isSuper = selectedRole === 'super_admin';

                                    return (
                                        <TableRow key={module.id} hover>
                                            <TableCell>
                                                <Typography variant="subtitle2" fontWeight={600}>{module.label}</Typography>
                                            </TableCell>
                                            {['read', 'write', 'delete'].map((type) => (
                                                <TableCell key={type} align="center">
                                                    <Switch
                                                        size="small"
                                                        checked={rolePerms.includes(type)}
                                                        onChange={() => handlePermissionToggle(module.id, type)}
                                                        disabled={isSuper} // Super admin always enabled conceptually, or just locked
                                                        color={
                                                            type === 'delete' ? 'error' :
                                                                type === 'write' ? 'secondary' : 'primary'
                                                        }
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box p={3} bgcolor="#f8fafc">
                        <Typography variant="caption" color="text.secondary" display="block" align="center">
                            Note: Changes to permissions may take a few minutes to reflect for logged-in users.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Stack>
    );
}
