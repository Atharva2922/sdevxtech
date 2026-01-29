'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import UserSidebar from '@/components/user/UserSidebar';
import DashboardOverview from '@/components/user/sections/DashboardOverview';
import ProjectsSection from '@/components/user/sections/ProjectsSection';
import ServicesSection from '@/components/user/sections/ServicesSection';
import MessagesSection from '@/components/user/sections/MessagesSection';
import ProfileSection from '@/components/user/sections/ProfileSection';
import SettingsSection from '@/components/user/sections/SettingsSection';

export default function UserDashboard() {
    const router = useRouter();
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [mobileOpen, setMobileOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const loadUser = async () => {
            // Priority 1: Check localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                    return; // Found in localStorage, done.
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    localStorage.removeItem('user');
                }
            }

            // Priority 2: Fetch from Session API (if localStorage missing or invalid)
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user)); // Sync back
                } else {
                    // Not authenticated
                    router.push('/login');
                }
            } catch (err) {
                console.error('Failed to fetch user session:', err);
                // Don't redirect immediately to avoid loops on network error, maybe show error?
                // But if we can't get user, we probably should redirect or show login button.
                router.push('/login');
            }
        };

        loadUser();

        // Listen for user updates
        window.addEventListener('user-updated', loadUser);

        return () => {
            window.removeEventListener('user-updated', loadUser);
        };
    }, [router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const section = params.get('section');
            if (section) {
                // Defer state update to avoid sync warning or accept it as initial sync
                // eslint-disable-next-line react/no-did-mount-set-state
                setCurrentSection(section);
                // Remove query parameter from URL
                window.history.replaceState({}, '', '/user');
            }
        }
    }, []);

    if (!user) {
        // Show Skeleton Loading State instead of plain text
        return (
            <Box display="flex" minHeight="100vh" bgcolor="#f8fafc">
                {/* Sidebar Skeleton */}
                {!isMobile && (
                    <Box sx={{ width: 280, height: '100vh', position: 'fixed', bgcolor: 'white', borderRight: '1px solid #e2e8f0', p: 3 }}>
                        <Box sx={{ height: 40, width: 120, bgcolor: 'grey.200', borderRadius: 1, mb: 4 }} />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Box key={i} sx={{ height: 48, width: '100%', bgcolor: 'grey.100', borderRadius: 2, mb: 1 }} />
                        ))}
                    </Box>
                )}
                {/* Content Skeleton */}
                <Box sx={{ flex: 1, ml: { xs: 0, md: '280px' }, p: 4 }}>
                    <Box sx={{ height: 32, width: 200, bgcolor: 'grey.200', borderRadius: 1, mb: 4 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3 }}>
                        {[1, 2, 3].map((i) => (
                            <Box key={i} sx={{ height: 160, bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0' }} />
                        ))}
                    </Box>
                </Box>
            </Box>
        );
    }

    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard':
                return <DashboardOverview onNavigate={setCurrentSection} user={user} />;
            case 'projects':
                return <ProjectsSection />;
            case 'services':
                return <ServicesSection />;
            case 'messages':
                return <MessagesSection />;
            case 'documents':
                return <Box>Documents Section (Coming Soon)</Box>;
            case 'profile':
                return <ProfileSection />;
            case 'settings':
                return <SettingsSection user={user} />;
            default:
                return <DashboardOverview />;
        }
    };

    const sidebarContent = (
        <UserSidebar
            currentSection={currentSection}
            setCurrentSection={(section) => {
                setCurrentSection(section);
                if (isMobile) setMobileOpen(false);
            }}
            userName={user.name}
            userEmail={user.email}
            userImage={user.image}
        />
    );

    return (
        <Box display="flex" minHeight="100vh" bgcolor="#f8fafc">
            {/* Mobile Menu Button */}
            {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        left: 16,
                        zIndex: 1300,
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'white' }
                    }}
                >
                    <MenuIcon size={24} />
                </IconButton>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <Box
                    sx={{
                        width: 280,
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        zIndex: 1200,
                    }}
                >
                    {sidebarContent}
                </Box>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 280,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    ml: { xs: 0, md: '280px' },
                    p: { xs: 2, sm: 3, md: 4 },
                    pt: { xs: 10, md: 4 },
                    minHeight: '100vh',
                }}
            >
                {renderSection()}
            </Box>
        </Box>
    );
}
