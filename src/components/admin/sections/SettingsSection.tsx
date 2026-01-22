'use client';

import { Grid, TextField, Box } from '@mui/material';

interface SettingsSectionProps {
    data: any;
    handleChange: (field: string, value: any) => void;
}

export default function SettingsSection({ data, handleChange }: SettingsSectionProps) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Site Title"
                    variant="outlined"
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: 'white'
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Site Description"
                    variant="outlined"
                    value={data.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: 'white'
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        fullWidth
                        label="Theme Color"
                        variant="outlined"
                        value={data.themeColor}
                        onChange={(e) => handleChange('themeColor', e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                bgcolor: 'white'
                            }
                        }}
                    />
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '12px',
                            bgcolor: data.themeColor,
                            border: '1px solid #e2e8f0',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}
