import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Grid, Card, CardContent, Button, Chip, CircularProgress, Alert } from '@mui/material';
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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
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
                            <Grid item xs={12} sm={6} md={4} key={index}>
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
        </Stack>
    );
}
