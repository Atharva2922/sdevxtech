import { Container, Button, Box } from '@mui/material';
import Image from 'next/image';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Hero({ heroData }: { heroData: any }) {
    if (!heroData) return null;

    return (
        <section id="hero" className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden bg-white pt-20 md:pt-24 pb-12 md:pb-16">
            {/* Background Text Effect - "SDEVX" */}
            <div className="absolute bottom-0 right-0 w-3/4 overflow-hidden select-none pointer-events-none opacity-[0.03] z-0">
                <h1 className="text-[15vw] font-black tracking-tighter text-right leading-none text-black uppercase whitespace-nowrap">
                    SDEVX
                    <span className="text-[#3b82f6] inline-block">TECH</span>
                </h1>
            </div>

            <Container maxWidth="xl" className="relative z-10">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Left Column: Text */}
                    <div className="flex flex-col items-start text-left justify-center">
                        <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                            <span className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-gray-500 font-bold">
                                {heroData.topTagline || 'VR TECHNOLOGY'}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tighter mb-8 md:mb-10 text-[#1a1a1a] uppercase">
                            <span className="block fade-in opacity-0 animate-[fadeIn_0.8s_forwards]">THE NEXT</span>
                            <span className="block fade-in delay-1 opacity-0 animate-[fadeIn_0.8s_0.2s_forwards]" style={{ color: 'var(--primary-color)' }}>{heroData.highlightText}</span>
                            <span className="block fade-in delay-2 opacity-0 animate-[fadeIn_0.8s_0.4s_forwards]">OF CONTROL.</span>
                        </h1>

                        <div className="max-w-xl mb-8 md:mb-12 fade-in delay-2 opacity-0 animate-[fadeIn_0.8s_0.6s_forwards]">
                            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
                                {heroData.subtext}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-center fade-in delay-2 opacity-0 animate-[fadeIn_0.8s_0.8s_forwards]">
                            <Button
                                variant="contained"
                                href={heroData.primaryButton?.href || '#'}
                                sx={{
                                    background: 'var(--primary-color)',
                                    color: '#ffffff',
                                    borderRadius: '8px',
                                    padding: { xs: '14px 32px', md: '16px 48px' },
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                                    '&:hover': {
                                        background: 'var(--primary-color)',
                                        filter: 'brightness(0.9)',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {heroData.primaryButton?.label || 'Get Started'}
                            </Button>
                        </div>

                        {/* Social Icons */}
                        {heroData.socialLinks && (
                            <div className="flex gap-3 md:gap-4 mt-8 md:mt-12 fade-in delay-3 opacity-0 animate-[fadeIn_0.8s_1.0s_forwards]">
                                {heroData.socialLinks.map((social: any, index: number) => {
                                    // Simple icon mapping since we know the keys
                                    let Icon = null;
                                    if (social.icon === 'Twitter') Icon = require('@mui/icons-material/Twitter').default;
                                    if (social.icon === 'Instagram') Icon = require('@mui/icons-material/Instagram').default;
                                    if (social.icon === 'Language') Icon = require('@mui/icons-material/Language').default;

                                    if (!Icon) return null;

                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] hover:bg-[var(--primary-color)]/5 transition-all duration-300"
                                            aria-label={social.icon}
                                        >
                                            <Icon fontSize="small" />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Hero Image */}
                    <div className="relative flex justify-center md:justify-end fade-in delay-2 group perspective-1000">
                        <div className="relative w-full max-w-[600px] aspect-[4/3] transition-all duration-700 ease-out transform group-hover:scale-105 group-hover:-translate-y-4">
                            <div className="absolute inset-0 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" style={{ backgroundColor: 'var(--primary-color)', opacity: 0.2 }}></div>
                            <Image
                                src="/images/hero-3d-graphic.png"
                                alt="VR Control Dashboard"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
