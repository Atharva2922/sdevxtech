'use client';

import { Container } from '@mui/material';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function About({ aboutData }: { aboutData: any }) {
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

    if (!aboutData) return null;

    return (
        <section
            id="about"
            ref={sectionRef}
            className="px-4 md:px-0 bg-[#f9fafb]"
            style={{
                paddingTop: '96px',
                paddingBottom: '80px',
            }}
        >
            <Container maxWidth="lg">
                <div className="reveal text-left mb-12">
                    <span className="block text-xs md:text-sm uppercase tracking-widest mb-3 font-semibold" style={{ color: 'var(--primary-color)' }}>
                        {aboutData.subHeading}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                        {aboutData.heading.replace('Digital Presence', '')} <span style={{ color: 'var(--primary-color)' }}>Digital Presence</span>
                    </h2>
                </div>

                <div className="reveal max-w-2xl space-y-6 text-left">
                    {aboutData.paragraphs.map((para: string, index: number) => (
                        <p key={index} className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            {para}
                        </p>
                    ))}
                </div>
            </Container>
        </section>
    );
}
