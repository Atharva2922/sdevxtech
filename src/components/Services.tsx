'use client';

import { Container, Card, CardContent } from '@mui/material';
import { Edit, Monitor, TrendingUp } from '@mui/icons-material';
import { useEffect, useRef } from 'react';

const services = [
    {
        icon: Edit,
        title: 'Web Design',
        description: 'Visually stunning designs that capture your brand\'s essence and engage your visitors from the first click.',
        delay: '',
    },
    {
        icon: Monitor,
        title: 'Responsive Development',
        description: 'Seamless experiences across all devices, ensuring your site looks perfect on mobile, tablet, and desktop.',
        delay: 'delay-1',
    },
    {
        icon: TrendingUp,
        title: 'Growth Strategy',
        description: 'SEO-optimized structures and user-centric features designed to drive traffic and convert visitors.',
        delay: 'delay-2',
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.reveal').forEach((el) => {
                            el.classList.add('active');
                        });
                    }
                });
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="services"
            ref={sectionRef}
            className="px-4 md:px-8 bg-gray-50"
            style={{
                paddingTop: '80px',
                paddingBottom: '80px',
            }}
        >
            <Container maxWidth="xl">
                <div className="reveal text-center md:text-left" style={{ marginBottom: '32px' }}>
                    <span className="block text-xs md:text-sm uppercase tracking-widest mb-2 font-semibold" style={{ color: 'var(--primary-color)' }}>
                        What We Do
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight" style={{ marginBottom: '16px' }}>
                        Tailored <span style={{ color: 'var(--primary-color)' }}>Solutions</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <Card
                                key={index}
                                className={`reveal ${service.delay}`}
                                sx={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '16px',
                                    padding: { xs: '20px', md: '24px' },
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                    height: '100%',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        borderColor: 'var(--primary-color)',
                                        boxShadow: '0 10px 20px -5px rgb(0 0 0 / 0.1)',
                                    },
                                }}
                            >
                                <CardContent sx={{ padding: '0 !important' }}>
                                    <div
                                        className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl mb-4 md:mb-6"
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: 'var(--primary-color)',
                                        }}
                                    >
                                        <IconComponent sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }} />
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-semibold" style={{ marginBottom: '12px' }}>{service.title}</h3>
                                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{service.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
