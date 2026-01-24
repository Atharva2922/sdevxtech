'use client';

import { useState, useRef } from 'react';
import { Grid, TextField, Box, Popover, ClickAwayListener } from '@mui/material';
import { HexColorPicker } from 'react-colorful';

interface SettingsSectionProps {
    data: any;
    handleChange: (field: string, value: any) => void;
}

export default function SettingsSection({ data, handleChange }: SettingsSectionProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
                        onClick={handleColorClick}
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '12px',
                            bgcolor: data.themeColor,
                            border: '1px solid #e2e8f0',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        PaperProps={{
                            sx: { p: 2, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                        }}
                    >
                        <HexColorPicker
                            color={data.themeColor}
                            onChange={(newColor) => handleChange('themeColor', newColor)}
                        />
                    </Popover>
                </Box>
            </Grid>
        </Grid>
    );
}
