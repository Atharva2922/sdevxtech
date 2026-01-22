'use client';

import { useState, useEffect } from 'react';
import {
    Typography, Box, Snackbar, Alert, Paper, Fade, Card, CardContent, Divider, Tab, Tabs, Stack
} from '@mui/material';
import {
    LayoutDashboard, Users, CreditCard, BarChart3,
    Settings, Shield, Activity, FileText
} from 'lucide-react';

// Import New Components
import AdminLayout from '@/components/admin/AdminLayout';
import AdminSidebar, { SIDEBAR_ITEMS } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// Import Sections
import SettingsSection from '@/components/admin/sections/SettingsSection';
import HeaderSection from '@/components/admin/sections/HeaderSection';
import HeroSection from '@/components/admin/sections/HeroSection';
import ServicesSection from '@/components/admin/sections/ServicesSection';
import AboutSection from '@/components/admin/sections/AboutSection';
import ContactSection from '@/components/admin/sections/ContactSection';
import FooterSection from '@/components/admin/sections/FooterSection';

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

const CONTENT_TABS = [
    { label: 'Header', id: 0 },
    { label: 'Hero', id: 1 },
    { label: 'Services', id: 2 },
    { label: 'About', id: 3 },
    { label: 'Contact', id: 4 },
    { label: 'Footer', id: 5 },
];

export default function AdminPage() {
    const [data, setData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(true);

    // Navigation State
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [currentContentTab, setCurrentContentTab] = useState(0);

    const [saving, setSaving] = useState(false);
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
        setSaving(true);
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
            setToast({ open: true, message: 'Error saving changes.', severity: 'error' });
        } finally {
            setSaving(false);
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
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f8fafc">
            <Typography variant="h6" color="text.secondary">Loading Dashboard...</Typography>
        </Box>
    );

    // Helper to get Header Title
    const getHeaderTitle = () => {
        const item = SIDEBAR_ITEMS.find(i => i.id === currentSection);
        return item ? item.label : 'Admin Panel';
    };

    const getHeaderDescription = () => {
        switch (currentSection) {
            case 'dashboard': return 'Overview of your platform performance';
            case 'content': return 'Manage website content and sections';
            case 'settings': return 'System configuration and preferences';
            default: return `Manage ${currentSection} settings`;
        }
    };

    // Render Dashboard View
    const renderDashboard = () => (
        <Stack spacing={3}>
            <Box display="flex" gap={3} flexWrap="wrap">
                {[
                    { label: 'Total Users', value: '1,234', icon: Users, color: '#6366f1' },
                    { label: 'Total Transactions', value: '$45,230', icon: CreditCard, color: '#10b981' },
                    { label: 'Page Views', value: '89.4k', icon: Activity, color: '#f59e0b' },
                    { label: 'Content Blocks', value: '42', icon: FileText, color: '#ec4899' }
                ].map((stat, i) => (
                    <Box key={i} flexGrow={1} minWidth={240}>
                        <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                    <Box p={1} borderRadius="12px" bgcolor={`${stat.color}15`} color={stat.color}>
                                        <stat.icon size={24} />
                                    </Box>
                                    <Typography variant="caption" color="success.main" fontWeight="bold">+12%</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" color="text.primary">{stat.value}</Typography>
                                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box>
                <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <BarChart3 size={48} color="#94a3b8" />
                    <Typography variant="h6" color="text.secondary" mt={2}>Analytics Chart Placeholder</Typography>
                    <Typography variant="body2" color="text.muted">Real-time data visualization coming soon</Typography>
                </Paper>
            </Box>
        </Stack>
    );

    // Render Content Management View
    const renderContentManager = () => (
        <Box>
            <Paper elevation={0} sx={{ mb: 3, borderBottom: '1px solid #e2e8f0', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                <Tabs
                    value={currentContentTab}
                    onChange={(_, v) => setCurrentContentTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 2, bgcolor: 'white' }}
                >
                    {CONTENT_TABS.map((tab) => (
                        <Tab key={tab.id} label={tab.label} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 64 }} />
                    ))}
                </Tabs>
            </Paper>

            <Fade in={true} key={currentContentTab}>
                <Paper elevation={0} sx={{
                    p: 4, borderRadius: '0 0 16px 16px', border: '1px solid #e2e8f0',
                    bgcolor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)'
                }}>
                    {currentContentTab === 0 && <HeaderSection data={data.header} handleArrayChange={(arr, i, f, v) => handleArrayChange('header', arr, i, f, v)} />}
                    {currentContentTab === 1 && <HeroSection data={data.hero} handleChange={(f, v, nf) => handleChange('hero', f, v, nf)} />}
                    {currentContentTab === 2 && <ServicesSection data={data.services} handleChange={(f, v) => handleChange('services', f, v)} handleArrayChange={(arr, i, f, v) => handleArrayChange('services', arr, i, f, v)} />}
                    {currentContentTab === 3 && <AboutSection data={data.about} handleChange={(f, v) => handleChange('about', f, v)} />}
                    {currentContentTab === 4 && <ContactSection data={data.contact} handleChange={(f, v) => handleChange('contact', f, v)} />}
                    {currentContentTab === 5 && <FooterSection data={data.footer} handleChange={(f, v) => handleChange('footer', f, v)} handleArrayChange={(arr, i, f, v) => handleArrayChange('footer', arr, i, f, v)} />}
                </Paper>
            </Fade>
        </Box>
    );

    // Main Content Switcher
    const renderMainContent = () => {
        switch (currentSection) {
            case 'dashboard': return renderDashboard();

            case 'content': return renderContentManager();

            case 'settings': return (
                <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                    <SettingsSection data={data.settings} handleChange={(f, v) => handleChange('settings', f, v)} />
                </Paper>
            );

            default: return (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh" color="text.secondary">
                    <Shield size={64} style={{ marginBottom: 16, opacity: 0.2 }} />
                    <Typography variant="h5" fontWeight="bold">Coming Soon</Typography>
                    <Typography>The {getHeaderTitle()} module is currently under development.</Typography>
                </Box>
            );
        }
    };

    return (
        <AdminLayout
            sidebar={<AdminSidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />}
        >
            <AdminHeader
                title={getHeaderTitle()}
                description={getHeaderDescription()}
                onSave={handleSave}
                isSaving={saving}
                showSaveButton={['content', 'settings'].includes(currentSection)}
            />

            {renderMainContent()}

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={Fade}
            >
                <Alert
                    severity={toast.severity}
                    sx={{ width: '100%', borderRadius: '12px', fontWeight: 500 }}
                    variant="filled"
                    onClose={() => setToast({ ...toast, open: false })}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </AdminLayout>
    );
}
