'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Grid, Card, CardContent, Button, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { Code, Palette, Search, Smartphone, TrendingUp, Shield } from 'lucide-react';

interface Service {
    _id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    features: string[];
    price: string;
    isActive: boolean;
}

export default function ServicesSection() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Request Dialog State
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [requestDetails, setRequestDetails] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);

    // Toast
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/services');

            if (!response.ok) {
                throw new Error('Failed to fetch services');
            }

            const data = await response.json();
            setServices(data.services || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenRequest = (service: Service) => {
        setSelectedService(service);
        setOpenDialog(true);
    };

    const handleSubmitRequest = async () => {
        if (!selectedService) return;
        if (!requestDetails.trim()) {
            setToast({ open: true, message: 'Please provide some details about your needs', severity: 'error' });
            return;
        }

        setRequestLoading(true);
        try {
            const res = await fetch('/api/user/services/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: selectedService._id,
                    serviceName: selectedService.name,
                    details: requestDetails
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Request failed');
            }

            setToast({ open: true, message: 'Service requested successfully! We will contact you soon.', severity: 'success' });
            setOpenDialog(false);
            setRequestDetails('');
            setSelectedService(null);
        } catch (err: unknown) {
            setToast({ open: true, message: err instanceof Error ? err.message : 'Request failed', severity: 'error' });
        } finally {
            setRequestLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const icons: any = { Code, Palette, Search, Smartphone, TrendingUp, Shield };
        return icons[iconName] || Code;
    };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Our Services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Request professional services for your business
                </Typography>
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

            {!loading && !error && (
                <Grid container spacing={3}>
                    {services.map((service, index) => {
                        const Icon = getIcon(service.icon);
                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                            transform: 'translateY(-4px)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box p={1.5} bgcolor={`${service.color}15`} borderRadius="12px" width="fit-content" mb={2}>
                                            <Icon size={28} color={service.color} />
                                        </Box>

                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {service.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            {service.description}
                                        </Typography>

                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={2}>
                                            {service.features.map((feature, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={feature}
                                                    size="small"
                                                    sx={{ borderRadius: '6px', mb: 0.5 }}
                                                />
                                            ))}
                                        </Stack>

                                        <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={2}>
                                            {service.price}
                                        </Typography>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => handleOpenRequest(service)}
                                            sx={{
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                borderColor: service.color,
                                                color: service.color,
                                                '&:hover': {
                                                    bgcolor: `${service.color}15`,
                                                    borderColor: service.color,
                                                },
                                            }}
                                        >
                                            Request Service
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Service Request Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: { borderRadius: '16px', maxWidth: 500, width: '100%' }
                }}
            >
                <DialogTitle fontWeight="bold">
                    Request {selectedService?.name}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <Typography variant="body2" color="text.secondary">
                            Tell us a bit about your requirements. Our team will get back to you shortly.
                        </Typography>
                        <TextField
                            label="Requirements / Details"
                            fullWidth
                            multiline
                            rows={4}
                            value={requestDetails}
                            onChange={(e) => setRequestDetails(e.target.value)}
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
                        onClick={handleSubmitRequest}
                        disabled={requestLoading}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            borderRadius: '8px',
                        }}
                    >
                        {requestLoading ? 'Submitting...' : 'Send Request'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast Notification */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ borderRadius: '12px' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
