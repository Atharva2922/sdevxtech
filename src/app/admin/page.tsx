'use client';

import { useState, useEffect } from 'react';
import {
    Typography, Box, Paper, TextField, Button,
    Snackbar, Alert, IconButton, Divider, Grid,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar
} from '@mui/material';
import {
    Save, Settings, Web, Image as ImageIcon,
    BusinessCenter, Info, ContactMail, CallToAction,
    ChevronRight
} from '@mui/icons-material';

interface ContentData {
    settings: any;
    header: any;
    hero: any;
    services: any;
    about: any;
    contact: any;
    footer: any;
    [key: string]: any;
}

const MENU_ITEMS = [
    { label: 'Settings', icon: Settings, id: 0 },
    { label: 'Header', icon: Web, id: 1 },
    { label: 'Hero Section', icon: ImageIcon, id: 2 },
    { label: 'Services', icon: BusinessCenter, id: 3 },
    { label: 'About', icon: Info, id: 4 },
    { label: 'Contact', icon: ContactMail, id: 5 },
    { label: 'Footer', icon: CallToAction, id: 6 },
];

export default function AdminPage() {
    const [data, setData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load content', err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setToast({ open: true, message: 'Changes saved successfully!', severity: 'success' });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            setToast({ open: true, message: 'Error saving changes', severity: 'error' });
        }
    };

    const handleChange = (section: string, field: string, value: any, nestedField?: string) => {
        if (!data) return;
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            if (nestedField) {
                newData[section][field][nestedField] = value;
            } else {
                newData[section][field] = value;
            }
            return newData;
        });
    };

    const handleArrayChange = (section: string, arrayName: string, index: number, field: string, value: any) => {
        if (!data) return;
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[section][arrayName][index][field] = value;
            return newData;
        });
    };

    if (loading || !data) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography>Loading admin panel...</Typography>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>

            {/* Sidebar */}
            <Box sx={{
                width: 280,
                flexShrink: 0,
                bgcolor: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <Box p={3} display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'var(--primary-color)', width: 32, height: 32 }}>S</Avatar>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        SDEVX Admin
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List component="nav" sx={{ px: 2 }}>
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                            <ListItemButton
                                key={item.id}
                                selected={isActive}
                                onClick={() => setCurrentTab(item.id)}
                                sx={{
                                    borderRadius: '12px',
                                    mb: 1,
                                    bgcolor: isActive ? 'rgba(99, 102, 241, 0.08) !important' : 'transparent',
                                    color: isActive ? 'var(--primary-color)' : 'text.secondary',
                                    '&:hover': {
                                        bgcolor: 'rgba(99, 102, 241, 0.04)',
                                        color: 'var(--primary-color)',
                                        '& .MuiListItemIcon-root': { color: 'var(--primary-color)' }
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    color: isActive ? 'var(--primary-color)' : 'text.secondary',
                                }}>
                                    <Icon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.95rem'
                                    }}
                                />
                                {isActive && <ChevronRight fontSize="small" />}
                            </ListItemButton>
                        );
                    })}
                </List>

                <Box mt="auto" p={3}>
                    <Box p={2} borderRadius={3} bgcolor="rgba(99, 102, 241, 0.05)" border="1px solid rgba(99, 102, 241, 0.1)">
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Logged in as Admin
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            v1.0.0
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh' }}>

                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {MENU_ITEMS[currentTab].label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your {MENU_ITEMS[currentTab].label.toLowerCase().replace(' section', '')} settings and content
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        sx={{
                            background: 'var(--primary-color)',
                            px: 3, py: 1,
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                            '&:hover': {
                                background: 'var(--primary-color)',
                                opacity: 0.9,
                                boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)',
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </Box>

                <Paper elevation={0} sx={{
                    p: 4,
                    borderRadius: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }}>

                    {/* Settings Tab */}
                    {currentTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Site Title" variant="outlined"
                                    value={data.settings.title}
                                    onChange={(e) => handleChange('settings', 'title', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Site Description" variant="outlined"
                                    value={data.settings.description}
                                    onChange={(e) => handleChange('settings', 'description', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box display="flex" gap={2} alignItems="center">
                                    <TextField
                                        fullWidth label="Theme Color" variant="outlined"
                                        value={data.settings.themeColor}
                                        onChange={(e) => handleChange('settings', 'themeColor', e.target.value)}
                                    />
                                    <Box
                                        sx={{
                                            width: 56, height: 56,
                                            borderRadius: '12px',
                                            bgcolor: data.settings.themeColor,
                                            border: '1px solid #e2e8f0',
                                            flexShrink: 0
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {/* Header Tab */}
                    {currentTab === 1 && (
                        <Box>
                            {data.header.navItems.map((item: any, index: number) => (
                                <Box key={index} display="flex" gap={2} mb={2}>
                                    <TextField
                                        fullWidth label="Label" size="small"
                                        value={item.label}
                                        onChange={(e) => handleArrayChange('header', 'navItems', index, 'label', e.target.value)}
                                    />
                                    <TextField
                                        fullWidth label="Link hash (#id)" size="small"
                                        value={item.href}
                                        onChange={(e) => handleArrayChange('header', 'navItems', index, 'href', e.target.value)}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Hero Tab */}
                    {currentTab === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Main Heading"
                                    value={data.hero.heading}
                                    onChange={(e) => handleChange('hero', 'heading', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Highlight Text (Color Gradient)"
                                    value={data.hero.highlightText}
                                    onChange={(e) => handleChange('hero', 'highlightText', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth multiline rows={2} label="Subtext"
                                    value={data.hero.subtext}
                                    onChange={(e) => handleChange('hero', 'subtext', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }}>Buttons</Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Primary Button Label" size="small"
                                    value={data.hero.primaryButton.label}
                                    onChange={(e) => handleChange('hero', 'primaryButton', e.target.value, 'label')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Primary Button Link" size="small"
                                    value={data.hero.primaryButton.href}
                                    onChange={(e) => handleChange('hero', 'primaryButton', e.target.value, 'href')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Secondary Button Label" size="small"
                                    value={data.hero.secondaryButton?.label || ''}
                                    onChange={(e) => handleChange('hero', 'secondaryButton', e.target.value, 'label')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Secondary Button Link" size="small"
                                    value={data.hero.secondaryButton?.href || ''}
                                    onChange={(e) => handleChange('hero', 'secondaryButton', e.target.value, 'href')}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Services Tab */}
                    {currentTab === 3 && (
                        <Box>
                            <Grid container spacing={3} mb={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Section Heading"
                                        value={data.services.heading}
                                        onChange={(e) => handleChange('services', 'heading', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Sub Heading"
                                        value={data.services.subHeading}
                                        onChange={(e) => handleChange('services', 'subHeading', e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            {data.services.items.map((item: any, index: number) => (
                                <Paper variant="outlined" key={index} sx={{ mb: 3, p: 3, borderRadius: '16px' }}>
                                    <Typography variant="subtitle2" mb={2} color="primary" fontWeight="bold">Service {index + 1}</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth label="Title" size="small"
                                                value={item.title}
                                                onChange={(e) => handleArrayChange('services', 'items', index, 'title', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth label="Icon (Lucide Name)" size="small"
                                                value={item.icon}
                                                onChange={(e) => handleArrayChange('services', 'items', index, 'icon', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth multiline rows={2} label="Description" size="small"
                                                value={item.description}
                                                onChange={(e) => handleArrayChange('services', 'items', index, 'description', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Box>
                    )}

                    {/* About Tab */}
                    {currentTab === 4 && (
                        <Box>
                            <Grid container spacing={3} mb={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Section Heading"
                                        value={data.about.heading}
                                        onChange={(e) => handleChange('about', 'heading', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Sub Heading"
                                        value={data.about.subHeading}
                                        onChange={(e) => handleChange('about', 'subHeading', e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ mb: 3 }} textAlign="left">Paragraphs</Divider>

                            {data.about.paragraphs.map((para: string, index: number) => (
                                <TextField
                                    key={index}
                                    fullWidth multiline rows={3} label={`Paragraph ${index + 1}`} sx={{ mb: 3 }}
                                    value={para}
                                    onChange={(e) => {
                                        const newParas = [...data.about.paragraphs];
                                        newParas[index] = e.target.value;
                                        handleChange('about', 'paragraphs', newParas);
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Contact Tab */}
                    {currentTab === 5 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Heading"
                                    value={data.contact.heading}
                                    onChange={(e) => handleChange('contact', 'heading', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth multiline rows={2} label="Subtext"
                                    value={data.contact.subtext}
                                    onChange={(e) => handleChange('contact', 'subtext', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Button Label"
                                    value={data.contact.buttonLabel}
                                    onChange={(e) => handleChange('contact', 'buttonLabel', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Email Address"
                                    value={data.contact.email}
                                    onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Footer Tab */}
                    {currentTab === 6 && (
                        <Box>
                            <Grid container spacing={3} mb={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Copyright Text"
                                        value={data.footer.copyright}
                                        onChange={(e) => handleChange('footer', 'copyright', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Divider sx={{ mb: 3 }} textAlign="left">Social Links</Divider>
                            {data.footer.socialLinks.map((item: any, index: number) => (
                                <Box key={index} display="flex" gap={2} mb={2}>
                                    <TextField
                                        label="Platform" size="small"
                                        value={item.label}
                                        onChange={(e) => handleArrayChange('footer', 'socialLinks', index, 'label', e.target.value)}
                                    />
                                    <TextField
                                        fullWidth label="URL" size="small"
                                        value={item.href}
                                        onChange={(e) => handleArrayChange('footer', 'socialLinks', index, 'href', e.target.value)}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Paper>

                <Snackbar
                    open={toast.open}
                    autoHideDuration={6000}
                    onClose={() => setToast({ ...toast, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={toast.severity} sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}
