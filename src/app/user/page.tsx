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
        const loadUser = () => {
            // Get user from localStorage
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } else {
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
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                Loading...
            </Box>
        );
    }

    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard':
                return <DashboardOverview onNavigate={setCurrentSection} />;
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
                return <Box>Settings Section (Coming Soon)</Box>;
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
            {!isMobile && sidebarContent}

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
