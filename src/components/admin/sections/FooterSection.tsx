'use client';

import { Box, Grid, TextField, Divider, Paper } from '@mui/material';

interface FooterSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (field: string, value: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleArrayChange: (arrayName: string, index: number, field: string, value: any) => void;
}

export default function FooterSection({ data, handleChange, handleArrayChange }: FooterSectionProps) {
    return (
        <Box>
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Copyright Text"
                        value={data.copyright}
                        onChange={(e) => handleChange('copyright', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Grid>
            </Grid>
            <Divider sx={{ mb: 3 }} textAlign="left">Social Links</Divider>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.socialLinks.map((item: any, index: number) => (
                <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        gap: 2,
                        borderRadius: '12px',
                        bgcolor: 'white',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <TextField
                        label="Platform"
                        size="small"
                        value={item.label}
                        onChange={(e) => handleArrayChange('socialLinks', index, 'label', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="URL"
                        size="small"
                        value={item.href}
                        onChange={(e) => handleArrayChange('socialLinks', index, 'href', e.target.value)}
                    />
                </Paper>
            ))}
        </Box>
    );
}
