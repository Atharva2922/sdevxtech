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
            className="px-4 md:px-0 bg-white"
            style={{
                paddingTop: '96px',
                paddingBottom: '96px',
            }}
        >
            <Container maxWidth="lg">
                <div
                    className="text-center py-20 md:py-28 px-8 md:px-16 rounded-[32px] border reveal max-w-5xl mx-auto relative overflow-hidden group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(217,70,239,0.03) 100%)',
                        borderColor: 'rgba(99,102,241,0.1)',
                        boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.1)'
                    }}
                >
                    {/* Decorative Blob */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

                    <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
                        {contactData.heading}
                    </h2>
                    <p className="relative text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
                        {contactData.subtext}
                    </p>

                    <Button
                        variant="contained"
                        href={`mailto:${contactData.email}`}
                        className="relative"
                        sx={{
                            background: 'var(--primary-color)',
                            color: '#ffffff',
                            borderRadius: '50px',
                            padding: { xs: '12px 28px', md: '14px 36px' },
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: '0 10px 20px -10px var(--primary-color)',
                            '&:hover': {
                                background: 'var(--primary-color)',
                                opacity: 0.9,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 20px 30px -10px var(--primary-color)',
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
