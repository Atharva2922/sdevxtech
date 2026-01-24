'use client';

import { Box, TextField, Typography, Paper } from '@mui/material';

interface HeaderSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleArrayChange: (arrayName: string, index: number, field: string, value: any) => void;
}

export default function HeaderSection({ data, handleArrayChange }: HeaderSectionProps) {
    return (
        <Box>
            <Typography variant="subtitle2" mb={2} color="text.secondary">Navigation Items</Typography>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.navItems.map((item: any, index: number) => (
                <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: '16px',
                        bgcolor: 'white',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            label="Label"
                            size="small"
                            value={item.label}
                            onChange={(e) => handleArrayChange('navItems', index, 'label', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '8px' }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Link hash (#id)"
                            size="small"
                            value={item.href}
                            onChange={(e) => handleArrayChange('navItems', index, 'href', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: '8px' }
                            }}
                        />
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}
