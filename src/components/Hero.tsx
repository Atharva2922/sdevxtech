import { Container, Button } from '@mui/material';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Hero({ heroData }: { heroData: any }) {
    if (!heroData) return null;

    return (
        <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20 px-4 md:px-0 bg-gradient-to-br from-white via-purple-50 to-white">
            {/* Background Glow */}
            <div
                className="absolute top-0 right-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] blur-[100px] -z-10 opacity-30"
                style={{
                    background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
                }}
            />

            <Container maxWidth="lg" className="relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 fade-in text-left">
                            {heroData.heading?.replace(heroData.highlightText, '')}
                            <br />
                            <span
                                className="bg-gradient-to-r from-gray-900 via-[var(--primary-color)] to-purple-600 bg-clip-text text-transparent"
                            >
                                {heroData.highlightText}
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-xl leading-relaxed fade-in delay-1 text-left">
                            {heroData.subtext}
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 fade-in delay-2">
                            <Button
                                variant="contained"
                                href={heroData.primaryButton?.href || '#'}
                                sx={{
                                    background: 'var(--primary-color)',
                                    color: '#ffffff',
                                    borderRadius: '50px',
                                    padding: { xs: '12px 28px', md: '14px 36px' },
                                    fontSize: { xs: '0.95rem', md: '1rem' },
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
                                {heroData.primaryButton?.label || 'Start'}
                            </Button>

                            <Button
                                variant="outlined"
                                href={heroData.secondaryButton?.href || '#'}
                                sx={{
                                    borderColor: '#e2e8f0',
                                    color: '#1a1a1a',
                                    borderRadius: '50px',
                                    padding: { xs: '12px 28px', md: '14px 36px' },
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: 'var(--primary-color)',
                                        background: 'rgba(99, 102, 241, 0.05)',
                                    },
                                }}
                            >
                                {heroData.secondaryButton?.label || 'Learn More'}
                            </Button>
                        </div>
                    </div>

                    {/* Right Visual - Hero Graphic */}
                    <div className="flex justify-center items-center relative fade-in delay-2">
                        <div className="relative w-full max-w-[500px] aspect-square transform hover:scale-105 transition-transform duration-500 ease-out">
                            {/* Animated blobs behind image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-purple-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />

                            <div className="relative w-full h-full drop-shadow-2xl">
                                <Image
                                    src="/images/hero-graphic.png"
                                    alt="SDEVX Technology Solutions"
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 500px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
