'use client';

import { Box, Grid, TextField, Divider } from '@mui/material';

interface AboutSectionProps {
    data: any;
    handleChange: (field: string, value: any) => void;
}

export default function AboutSection({ data, handleChange }: AboutSectionProps) {
    return (
        <Box>
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Section Heading"
                        value={data.heading}
                        onChange={(e) => handleChange('heading', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Sub Heading"
                        value={data.subHeading}
                        onChange={(e) => handleChange('subHeading', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} textAlign="left">Paragraphs</Divider>

            {data.paragraphs.map((para: string, index: number) => (
                <TextField
                    key={index}
                    fullWidth
                    multiline
                    rows={3}
                    label={`Paragraph ${index + 1}`}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    value={para}
                    onChange={(e) => {
                        const newParas = [...data.paragraphs];
                        newParas[index] = e.target.value;
                        handleChange('paragraphs', newParas);
                    }}
                />
            ))}
        </Box>
    );
}
