'use client';

import { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Chip, Typography, Stack, Grid, Card, CardContent,
    Button, Divider, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import {
    MoreVertical, Download, RotateCcw, CheckCircle, AlertCircle, Clock,
    DollarSign, TrendingUp, CreditCard, Search, Plus
} from 'lucide-react';

// Define Transaction Interface matching our new Model
interface Transaction {
    _id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    amount: number;
    currency: string;
    method?: string;
    status: 'Success' | 'Failed' | 'Pending';
    razorpayOrderId?: string;
    description?: string;
    createdAt: string;
}

export default function TransactionsSection() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Payment Dialog State
    const [openPayment, setOpenPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDescription, setPaymentDescription] = useState('');
    const [processing, setProcessing] = useState(false);

    // Fetch Transactions (TODO: Implement GET /api/transactions endpoint later, for now we just show what we create or mock)
    // Simulating empty list for now until next step or just assume we add to list manually after payment

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

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!paymentAmount) return;

        setProcessing(true);
        try {
            // 1. Load Script
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load');
                return;
            }

            // 2. Create Order
            const res = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(paymentAmount),
                    description: paymentDescription
                }),
                credentials: 'include'
            });

            const orderData = await res.json();
            if (!res.ok) throw new Error(orderData.error);

            // 3. Open Razorpay Options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Should be in env
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'SDEVX Tech',
                description: paymentDescription || 'Transaction',
                order_id: orderData.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async function (response: any) {
                    // 4. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            }),
                            credentials: 'include'
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            alert('Payment Successful!');
                            setOpenPayment(false);
                            // Ideally fetch transactions here
                            // fetchTransactions();

                            // Mock update list for immediate feedback
                            const newTxn: Transaction = {
                                _id: orderData.id, // temp id
                                user: 'Current User',
                                amount: parseFloat(paymentAmount),
                                currency: 'INR',
                                status: 'Success',
                                description: paymentDescription,
                                createdAt: new Date().toISOString()
                            };
                            setTransactions([newTxn, ...transactions]);
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Verification Error');
                    }
                },
                prefill: {
                    name: 'Admin User',
                    email: 'admin@test.com',
                },
                theme: {
                    color: '#6366f1',
                },
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: unknown) {
            console.error('Payment Error:', error);
            alert(error instanceof Error ? error.message : 'Payment Failed');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Stack spacing={3}>
            {/* Overview Stats (Keep Mock for Visuals for now or connect later) */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box flex={1}>
                    <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'primary.main', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>Total Revenue</Typography>
                                    <Typography variant="h4" fontWeight="bold">₹45,230</Typography>
                                </Box>
                                <Box p={1} bgcolor="rgba(255,255,255,0.2)" borderRadius="12px">
                                    <DollarSign size={24} color="white" />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                {/* ... other stats ... */}
            </Stack>

            {/* Transactions Table */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box p={2} borderBottom="1px solid #e2e8f0" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">Transactions</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={16} />}
                            onClick={() => setOpenPayment(true)}
                            sx={{ textTransform: 'none' }}
                        >
                            New Transaction
                        </Button>
                    </Stack>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No recent transactions. Create one to test Razorpay.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((txn) => (
                                    <TableRow key={txn._id} hover>
                                        <TableCell>{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{txn.description || 'Payment'}</TableCell>
                                        <TableCell>₹{txn.amount}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={txn.status}
                                                size="small"
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                color={getStatusColor(txn.status) as any}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small"><MoreVertical size={16} /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Payment Dialog */}
            <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Initiate Payment</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Amount (INR)"
                            type="number"
                            fullWidth
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            value={paymentDescription}
                            onChange={(e) => setPaymentDescription(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handlePayment}
                        disabled={processing || !paymentAmount}
                    >
                        {processing ? 'Processing...' : 'Pay Now'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
