'use client';

import { useState, useEffect } from 'react';
import { Fab, Popover, Box, Typography } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { HexColorPicker } from 'react-colorful';

export default function ColorPicker() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [color, setColor] = useState('#6366f1');

    const applyColor = (newColor: string) => {
        document.documentElement.style.setProperty('--primary-color', newColor);
        localStorage.setItem('themeColor', newColor);
    };

    useEffect(() => {
        // Load saved color from localStorage
        const savedColor = localStorage.getItem('themeColor');
        if (savedColor) {
            setColor(savedColor);
            applyColor(savedColor);
        }
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        applyColor(newColor);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Fab
                color="primary"
                aria-label="color picker"
                onClick={handleClick}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                }}
            >
                <PaletteIcon />
            </Fab>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Choose Theme Color
                    </Typography>
                    <HexColorPicker color={color} onChange={handleColorChange} />
                    <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                        {color}
                    </Typography>
                </Box>
            </Popover>
        </>
    );
}
