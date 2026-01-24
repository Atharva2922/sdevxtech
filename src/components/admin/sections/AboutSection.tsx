'use client';

import { Box, Grid, TextField, Divider } from '@mui/material';

interface AboutSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (field: string, value: any) => void;
}

export default function AboutSection({ data, handleChange }: AboutSectionProps) {
    return (
        <Box>
            <Box mb={4} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 3 }}>
                <Box>
                    <TextField
                        fullWidth
                        label="Section Heading"
                        value={data.heading}
                        onChange={(e) => handleChange('heading', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Box>
                <Box>
                    <TextField
                        fullWidth
                        label="Sub Heading"
                        value={data.subHeading}
                        onChange={(e) => handleChange('subHeading', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' } }}
                    />
                </Box>
            </Box>

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
