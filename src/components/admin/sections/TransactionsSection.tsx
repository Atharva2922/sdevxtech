import { useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Chip, Typography, Stack, Grid, Card, CardContent,
    Button, Divider
} from '@mui/material';
import {
    MoreVertical, Download, RotateCcw, CheckCircle, AlertCircle, Clock,
    DollarSign, TrendingUp, CreditCard, Search
} from 'lucide-react';

// Mock Data Type
interface Transaction {
    id: string;
    user: string;
    amount: string;
    method: string;
    status: 'Success' | 'Failed' | 'Pending';
    date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'TXN-78901', user: 'Atharv G', amount: '$120.00', method: 'Visa ending 4242', status: 'Success', date: '2024-03-20 14:30' },
    { id: 'TXN-78902', user: 'John Doe', amount: '$45.50', method: 'Mastercard ending 5555', status: 'Pending', date: '2024-03-20 16:15' },
    { id: 'TXN-78903', user: 'Jane Smith', amount: '$200.00', method: 'PayPal', status: 'Failed', date: '2024-03-19 09:45' },
    { id: 'TXN-78904', user: 'Mike Johnson', amount: '$75.00', method: 'Visa ending 1234', status: 'Success', date: '2024-03-18 11:20' },
    { id: 'TXN-78905', user: 'Sarah Wilson', amount: '$99.99', method: 'Amex ending 0005', status: 'Success', date: '2024-03-18 10:00' },
];

export default function TransactionsSection() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, txn: Transaction) => {
        setAnchorEl(event.currentTarget);
        setSelectedTxn(txn);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTxn(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Success': return 'success';
            case 'Failed': return 'error';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Success': return <CheckCircle size={14} />;
            case 'Failed': return <AlertCircle size={14} />;
            case 'Pending': return <Clock size={14} />;
            default: return null;
        }
    };

    return (
        <Stack spacing={3}>
            {/* Overview Stats */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box flex={1}>
                    <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'primary.main', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>Total Revenue</Typography>
                                    <Typography variant="h4" fontWeight="bold">$45,230.50</Typography>
                                </Box>
                                <Box p={1} bgcolor="rgba(255,255,255,0.2)" borderRadius="12px">
                                    <DollarSign size={24} color="white" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                <Box flex={1}>
                    <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Monthly Income</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="text.primary">$12,450.00</Typography>
                                </Box>
                                <Box p={1} bgcolor="#ecfdf5" borderRadius="12px">
                                    <TrendingUp size={24} color="#10b981" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                <Box flex={1}>
                    <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Pending Payments</Typography>
                                    <Typography variant="h4" fontWeight="bold" color="text.primary">$1,280.00</Typography>
                                </Box>
                                <Box p={1} bgcolor="#fff7ed" borderRadius="12px">
                                    <Clock size={24} color="#f97316" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Stack>

            {/* Transactions Table */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box p={2} borderBottom="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">Recent Transactions</Typography>
                    <Button startIcon={<Download size={16} />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
                        Export CSV
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Transaction ID</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Payment Method</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {MOCK_TRANSACTIONS.map((txn) => (
                                <TableRow key={txn.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>{txn.id}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{txn.user}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{txn.amount}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CreditCard size={14} color="#64748b" />
                                            <Typography variant="body2">{txn.method}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={txn.status}
                                            size="small"
                                            icon={getStatusIcon(txn.status) as any}
                                            color={getStatusColor(txn.status) as any}
                                            variant="outlined"
                                            sx={{ fontWeight: 500, borderRadius: '6px', '& .MuiChip-icon': { marginLeft: '8px' } }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{txn.date}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, txn)}>
                                            <MoreVertical size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
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
                    <Download size={16} style={{ marginRight: 12 }} /> Download Invoice
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: 'warning.main' }}>
                    <RotateCcw size={16} style={{ marginRight: 12 }} /> Refund Payment
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'success.main' }}>
                    <CheckCircle size={16} style={{ marginRight: 12 }} /> Mark as Resolved
                </MenuItem>
            </Menu>
        </Stack>
    );
}
