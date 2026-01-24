'use client';

import { Box, Grid, TextField, Paper, Typography } from '@mui/material';

interface ServicesSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (field: string, value: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleArrayChange: (arrayName: string, index: number, field: string, value: any) => void;
}

export default function ServicesSection({ data, handleChange, handleArrayChange }: ServicesSectionProps) {
    return (
        <Box>
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Section Heading"
                        value={data.heading}
                        onChange={(e) => handleChange('heading', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Sub Heading"
                        value={data.subHeading}
                        onChange={(e) => handleChange('subHeading', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Grid>
            </Grid>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.items.map((item: any, index: number) => (
                <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: 'white',
                        border: '1px solid #e2e8f0',
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }
                    }}
                >
                    <Typography variant="subtitle2" mb={2} color="primary" fontWeight="bold">
                        Service {index + 1}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                size="small"
                                value={item.title}
                                onChange={(e) => handleArrayChange('items', index, 'title', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Icon (Lucide Name)"
                                size="small"
                                value={item.icon}
                                onChange={(e) => handleArrayChange('items', index, 'icon', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Description"
                                size="small"
                                value={item.description}
                                onChange={(e) => handleArrayChange('items', index, 'description', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
}
