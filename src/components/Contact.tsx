'use client';

import { Container, Button } from '@mui/material';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Contact({ contactData }: { contactData: any }) {
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

    if (!contactData) return null;

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="px-4 md:px-8"
            style={{
                paddingTop: '80px',
                paddingBottom: '80px',
            }}
        >
            <Container maxWidth="xl">
                <div
                    className="text-center py-12 md:py-16 lg:py-20 px-6 md:px-12 rounded-3xl border reveal max-w-4xl mx-auto"
                    style={{
                        background: 'linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%)',
                        borderColor: '#e2e8f0',
                    }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight" style={{ marginBottom: '16px' }}>
                        {contactData.heading}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ marginBottom: '32px' }}>
                        {contactData.subtext}
                    </p>

                    <Button
                        variant="contained"
                        href={`mailto:${contactData.email}`}
                        sx={{
                            background: 'var(--primary-color)',
                            color: '#ffffff',
                            borderRadius: '50px',
                            padding: { xs: '12px 32px', md: '14px 40px' },
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                background: 'var(--primary-color)',
                                opacity: 0.9,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.3)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {contactData.buttonLabel}
                    </Button>
                </div>
            </Container>
        </section>
    );
}
