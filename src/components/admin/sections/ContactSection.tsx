'use client';

import { Grid, TextField, Box } from '@mui/material';

interface ContactSectionProps {
    data: any;
    handleChange: (field: string, value: any) => void;
}

export default function ContactSection({ data, handleChange }: ContactSectionProps) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Heading"
                    value={data.heading}
                    onChange={(e) => handleChange('heading', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Button Label"
                    value={data.buttonLabel}
                    onChange={(e) => handleChange('buttonLabel', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Email Address"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                />
            </Grid>
        </Grid>
    );
}
