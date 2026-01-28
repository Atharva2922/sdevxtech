'use client';

import { useState } from 'react';
import {
    Box, Paper, Tabs, Tab, Typography, Grid, TextField, Switch, Divider,
    List, ListItem, ListItemText, ListItemSecondaryAction, Button,
    Alert, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import {
    Settings, Users, Shield, Key, FileText, Bell, Lock, Database,
    Save, RefreshCw
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface SettingsSectionProps {
    data: any;
    handleChange: (field: string, value: any) => void;
}

export default function SettingsSection({ data, handleChange }: SettingsSectionProps) {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    // Helper to render Color Picker (Kept from original)
    const renderColorPicker = (label: string, field: string) => (
        <Grid size={{ xs: 12, sm: 6 }}>
            <Box display="flex" gap={2} alignItems="center">
                <TextField
                    fullWidth
                    label={label}
                    variant="outlined"
                    value={data[field] || '#ffffff'}
                    onChange={(e) => handleChange(field, e.target.value)}
                />
                <Box
                    sx={{
                        width: 56, height: 56, borderRadius: '12px',
                        bgcolor: data[field] || '#ffffff',
                        border: '1px solid #e2e8f0', cursor: 'pointer'
                    }}
                />
            </Box>
        </Grid>
    );

    return (
        <Box>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" fontWeight="bold">Platform Settings</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configure global settings, security policies, and user management rules.
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<RefreshCw size={18} />}>
                    Reset Defaults
                </Button>
            </Box>

            <Paper elevation={0} sx={{
                borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden',
                display: 'flex', minHeight: 600
            }}>
                {/* Vertical Tabs Sidebar */}
                <Box sx={{ width: 260, borderRight: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={currentTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                alignItems: 'flex-start',
                                textAlign: 'left',
                                textTransform: 'none',
                                fontWeight: 500,
                                minHeight: 56,
                                pl: 3
                            }
                        }}
                    >
                        <Tab icon={<Settings size={18} />} iconPosition="start" label="General" />
                        <Tab icon={<Users size={18} />} iconPosition="start" label="User Management" />
                        <Tab icon={<Key size={18} />} iconPosition="start" label="Authentication" />
                        <Tab icon={<Shield size={18} />} iconPosition="start" label="Roles & Permissions" />
                        <Tab icon={<Database size={18} />} iconPosition="start" label="Projects & Services" />
                        <Tab icon={<Bell size={18} />} iconPosition="start" label="Messaging" />
                        <Tab icon={<FileText size={18} />} iconPosition="start" label="Files & Documents" />
                        <Tab icon={<Lock size={18} />} iconPosition="start" label="Security & Logs" />
                    </Tabs>
                </Box>

                {/* Content Area */}
                <Box sx={{ flex: 1, p: 4 }}>
                    {/* Tab 0: General */}
                    {currentTab === 0 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>General Settings</Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth label="Platform Name"
                                        value={data.title || ''}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth multiline rows={3} label="Platform Description"
                                        value={data.description || ''}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign="left"><Typography variant="caption">Theming</Typography></Divider>
                                </Grid>
                                {renderColorPicker("Primary Color", "themeColor")}
                                {renderColorPicker("Secondary Color", "secondaryColor")}
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 1: User Management */}
                    {currentTab === 1 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>User Policies</Typography>
                            <List>
                                <SettingsSwitch label="Allow New Registrations" description="If disabled, only admins can create users." />
                                <SettingsSwitch label="Require Email Verification" description="Users must verify email before logging in." />
                                <SettingsSwitch label="Automatic Account Approval" description="Automatically approve new user accounts." />
                            </List>
                        </Box>
                    )}

                    {/* Tab 2: Authentication */}
                    {currentTab === 2 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Authentication Rules</Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Session Timeout</InputLabel>
                                        <Select label="Session Timeout" defaultValue={30}>
                                            <MenuItem value={15}>15 Minutes</MenuItem>
                                            <MenuItem value={30}>30 Minutes</MenuItem>
                                            <MenuItem value={60}>1 Hour</MenuItem>
                                            <MenuItem value={1440}>24 Hours</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <SettingsSwitch label="Enable Google OAuth" description="Allow users to login with Google." />
                                    <SettingsSwitch label="Enable Phone OTP" description="Allow users to login with Phone OTP." />
                                    <SettingsSwitch label="Enforce Strong Passwords" description="Require uppercase, numbers, and symbols." />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Tab 7: Security (Example of complex tab) */}
                    {currentTab === 7 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Security & Logs</Typography>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Security logs are immutable and retained for 90 days.
                            </Alert>
                            <List>
                                <SettingsSwitch label="Enable Audit Logging" description="Track all admin actions." checked={true} />
                                <Divider variant="inset" component="li" />
                                <SettingsSwitch label="Failed Login Rate Limiting" description="Block IP after 5 failed attempts." checked={true} />
                                <Divider variant="inset" component="li" />
                                <SettingsSwitch label="Force SSL/TLS" description="Redirect all HTTP traffic to HTTPS." checked={true} />
                            </List>
                            <Box mt={3}>
                                <Button variant="outlined" color="error">Flush All Active Sessions</Button>
                            </Box>
                        </Box>
                    )}

                    {/* Placeholders for other tabs */}
                    {[3, 4, 5, 6].includes(currentTab) && (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={300} color="text.secondary">
                            <Settings size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                            <Typography>This module configuration is coming soon.</Typography>
                        </Box>
                    )}

                </Box>
            </Paper>
        </Box>
    );
}

function SettingsSwitch({ label, description, checked = false }: { label: string, description: string, checked?: boolean }) {
    return (
        <ListItem disableGutters>
            <ListItemText
                primary={<Typography fontWeight="500">{label}</Typography>}
                secondary={description}
            />
            <ListItemSecondaryAction>
                <Switch edge="end" defaultChecked={checked} />
            </ListItemSecondaryAction>
        </ListItem>
    );
}
