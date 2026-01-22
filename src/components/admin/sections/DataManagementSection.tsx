import { useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Chip, Typography, Stack,
    TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Divider, Grid
} from '@mui/material';
import {
    MoreVertical, Edit, Trash2, Search, Filter, Plus, Upload, FileSpreadsheet,
    Download, RefreshCcw, Truck, MapPin, Calendar
} from 'lucide-react';

// Mock Data Type
interface DataRecord {
    id: string;
    type: 'Transport' | 'Land';
    reference: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Cancelled';
    amount: string;
    details: string;
}

const MOCK_RECORDS: DataRecord[] = [
    { id: 'REC-001', type: 'Transport', reference: 'TR-2024-850', date: '2024-03-10', status: 'Completed', amount: '$1,200', details: 'Logistics delivery to Zone A' },
    { id: 'REC-002', type: 'Land', reference: 'LR-Plot-45', date: '2024-03-12', status: 'Pending', amount: '$45,000', details: 'Plot sale agreement' },
    { id: 'REC-003', type: 'Transport', reference: 'TR-2024-851', date: '2024-03-14', status: 'Pending', amount: '$850', details: 'Material transport' },
    { id: 'REC-004', type: 'Transport', reference: 'TR-2024-852', date: '2024-03-15', status: 'Cancelled', amount: '$0', details: 'Cancelled by client' },
    { id: 'REC-005', type: 'Land', reference: 'LR-Survey-12', date: '2024-03-18', status: 'Completed', amount: '$2,500', details: 'Land survey service' },
];

export default function DataManagementSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
    const [openUpload, setOpenUpload] = useState(false);

    // Filtered Records
    const records = MOCK_RECORDS.filter(r =>
        r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: DataRecord) => {
        setAnchorEl(event.currentTarget);
        setSelectedRecord(record);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRecord(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Pending': return 'warning';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Stack spacing={3}>
            {/* Toolbar */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search records..."
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
                            startIcon={<Upload size={18} />}
                            onClick={() => setOpenUpload(true)}
                            sx={{ borderColor: '#e2e8f0', color: 'text.secondary', textTransform: 'none' }}
                        >
                            Bulk Upload
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={18} />}
                            sx={{ bgcolor: 'primary.main', textTransform: 'none', borderRadius: '8px' }}
                        >
                            Add Entry
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Data Table */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Reference</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Details</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        {records.length > 0 ? (
                            <TableBody>
                                {records.map((row) => (
                                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>{row.reference}</Typography>
                                            <Typography variant="caption" color="text.secondary">{row.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {row.type === 'Transport' ? <Truck size={16} /> : <MapPin size={16} />}
                                                <Typography variant="body2">{row.type}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap title={row.details}>
                                                {row.details}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                                <Calendar size={14} />
                                                <Typography variant="body2">{row.date}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{row.amount}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                color={getStatusColor(row.status) as any}
                                                variant="outlined"
                                                sx={{ fontWeight: 500, borderRadius: '6px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            <Search size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                            <Typography variant="h6" color="text.secondary">No records found</Typography>
                                            <Typography variant="body2" color="text.secondary">Try adjusting your search terms</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Paper>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: '12px', minWidth: 160, mt: 1 }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <Edit size={16} style={{ marginRight: 12 }} /> Edit Detail
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                    <Trash2 size={16} style={{ marginRight: 12 }} /> Delete
                </MenuItem>
            </Menu>

            {/* Bulk Upload Dialog */}
            <Dialog
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                PaperProps={{ sx: { borderRadius: '16px', maxWidth: 500 } }}
            >
                <DialogTitle>Bulk Upload Data</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            border: '2px dashed #94a3b8',
                            borderRadius: '12px',
                            p: 4,
                            textAlign: 'center',
                            bgcolor: '#f8fafc',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#f1f5f9', borderColor: 'primary.main' }
                        }}
                    >
                        <FileSpreadsheet size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Drop your CSV or Excel file here
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            or click to browse
                        </Typography>
                        <Button size="small" variant="text" startIcon={<Download size={16} />}>
                            Download Template
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenUpload(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button variant="contained" onClick={() => setOpenUpload(false)}>Upload Files</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
