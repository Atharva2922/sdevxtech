import { Container, Button } from '@mui/material';

export default function Hero({ heroData }: { heroData: any }) {
    if (!heroData) return null;

    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden py-24 md:py-32 px-4 md:px-8">
            {/* Background Glow */}
            <div
                className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] blur-[100px] -z-10 opacity-20"
                style={{
                    background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
                }}
            />

            <Container maxWidth="xl" className="relative z-10">
                <div className="max-w-4xl mx-auto md:mx-0">
                    <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 md:mb-8 fade-in">
                        {heroData.heading?.replace(heroData.highlightText, '')}
                        <br />
                        <span
                            className="bg-gradient-to-r from-gray-900 via-[var(--primary-color)] to-purple-600 bg-clip-text text-transparent"
                        >
                            {heroData.highlightText}
                        </span>
                    </h1>

                    <p className="text-lg sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl leading-relaxed fade-in delay-1">
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
                                padding: { xs: '10px 24px', md: '12px 28px' },
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
                                padding: { xs: '10px 24px', md: '12px 28px' },
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
            </Container>
        </section>
    );
}
