'use client';

import { Grid, TextField, Divider, Box, Typography } from '@mui/material';

interface HeroSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (field: string, value: any, nestedField?: string) => void;
}

export default function HeroSection({ data, handleChange }: HeroSectionProps) {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Main Heading"
                    value={data.heading}
                    onChange={(e) => handleChange('heading', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Highlight Text (Color Gradient)"
                    value={data.highlightText}
                    onChange={(e) => handleChange('highlightText', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Subtext"
                    value={data.subtext}
                    onChange={(e) => handleChange('subtext', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }}>
                    <Typography variant="caption" color="text.secondary">BUTTONS</Typography>
                </Divider>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Box bgcolor="white" p={2} borderRadius="12px" border="1px solid #e2e8f0">
                    <Typography variant="subtitle2" mb={2} color="primary">Primary Button</Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            fullWidth
                            label="Label"
                            size="small"
                            value={data.primaryButton.label}
                            onChange={(e) => handleChange('primaryButton', e.target.value, 'label')}
                        />
                        <TextField
                            fullWidth
                            label="Link"
                            size="small"
                            value={data.primaryButton.href}
                            onChange={(e) => handleChange('primaryButton', e.target.value, 'href')}
                        />
                    </Box>
                </Box>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Box bgcolor="white" p={2} borderRadius="12px" border="1px solid #e2e8f0">
                    <Typography variant="subtitle2" mb={2} color="secondary">Secondary Button</Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            fullWidth
                            label="Label"
                            size="small"
                            value={data.secondaryButton?.label || ''}
                            onChange={(e) => handleChange('secondaryButton', e.target.value, 'label')}
                        />
                        <TextField
                            fullWidth
                            label="Link"
                            size="small"
                            value={data.secondaryButton?.href || ''}
                            onChange={(e) => handleChange('secondaryButton', e.target.value, 'href')}
                        />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
