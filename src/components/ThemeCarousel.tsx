'use client';

import { useState } from 'react';
import { Container, IconButton, Box, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

const slides = [
    {
        id: 1,
        title: 'Web Design',
        image: '/images/service-web-design.png',
        color: '#8b5cf6'
    },
    {
        id: 2,
        title: 'Responsive Development',
        image: '/images/service-responsive-dev.png',
        color: '#14b8a6'
    },
    {
        id: 3,
        title: 'Growth Strategy',
        image: '/images/service-growth-strategy.png',
        color: '#f59e0b'
    },
    {
        id: 4,
        title: 'Mobile App Development',
        image: '/images/service-mobile-app.png',
        color: '#ec4899'
    },
    {
        id: 5,
        title: 'Security & Maintenance',
        image: '/images/service-security-maintenance.png',
        color: '#06b6d4'
    }
];

export default function ThemeCarousel() {
    const [activeIndex, setActiveIndex] = useState(0); // Start with first service

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Calculate indices for visible slides: Prev, Current, Next
    const getSlideIndex = (offset: number) => {
        return (activeIndex + offset + slides.length) % slides.length;
    };

    const prevIndex = getSlideIndex(-1);
    const nextIndex = getSlideIndex(1);

    return (
        <section className="py-12 md:py-24 bg-gray-50 overflow-hidden relative">
            <Container maxWidth="lg">
                {/* Header */}
                <div className="flex justify-between items-end mb-8 md:mb-16 px-2 md:px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 font-light">Our Services</h2>
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 font-light">
                        {String(activeIndex + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
                    </span>
                </div>

                <Box sx={{ position: 'relative', height: { xs: '450px', sm: '500px', md: '550px' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Navigation Arrows */}
                    <IconButton
                        onClick={handlePrev}
                        sx={{
                            position: 'absolute',
                            left: { xs: '5px', sm: '20px', md: '10%' },
                            zIndex: 20,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            width: { xs: '36px', md: '40px' },
                            height: { xs: '36px', md: '40px' },
                            '&:hover': { bgcolor: 'white' }
                        }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />
                    </IconButton>

                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: 'absolute',
                            right: { xs: '5px', sm: '20px', md: '10%' },
                            zIndex: 20,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            width: { xs: '36px', md: '40px' },
                            height: { xs: '36px', md: '40px' },
                            '&:hover': { bgcolor: 'white' }
                        }}
                    >
                        <ArrowForwardIosIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />
                    </IconButton>

                    {/* Cards Container */}
                    <div className="relative w-full max-w-4xl h-[350px] sm:h-[380px] md:h-[400px] flex items-center justify-center perspective-1000">
                        {slides.map((slide, index) => {
                            // Determine position relative to active
                            // This simple logic works best for 3 visible items. 
                            // For a robust circular carousel with many items, we might need a different approach,
                            // but for this specific design with 3 main focal points, we handle "active", "prev", "next" specially.

                            let position = 'hidden';
                            if (index === activeIndex) position = 'active';
                            else if (index === prevIndex) position = 'prev';
                            else if (index === nextIndex) position = 'next';

                            // Styles based on position
                            const isHidden = position === 'hidden';

                            // Transform styles
                            let transform = 'scale(0.8) translateX(0)';
                            let zIndex = 0;
                            let opacity = 0;

                            if (position === 'active') {
                                transform = 'scale(1.1) translateX(0) translateZ(100px)';
                                zIndex = 10;
                                opacity = 1;
                            } else if (position === 'prev') {
                                transform = 'scale(0.85) translateX(-80%) translateZ(0)';
                                zIndex = 5;
                                opacity = 0.6;
                            } else if (position === 'next') {
                                transform = 'scale(0.85) translateX(80%) translateZ(0)';
                                zIndex = 5;
                                opacity = 0.6;
                            }

                            if (isHidden) return null;

                            return (
                                <div
                                    key={slide.id}
                                    className="absolute transition-all duration-500 ease-out cursor-pointer flex flex-col items-center"
                                    style={{
                                        transform,
                                        zIndex,
                                        opacity,
                                    }}
                                    onClick={() => {
                                        if (position === 'prev') handlePrev();
                                        if (position === 'next') handleNext();
                                    }}
                                >
                                    <div className="relative w-[200px] sm:w-[240px] md:w-[280px] h-[240px] sm:h-[280px] md:h-[320px] rounded-[20px] md:rounded-[30px] overflow-hidden shadow-2xl group">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    {/* Title below the image */}
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        sx={{
                                            fontFamily: 'inherit',
                                            fontWeight: 500,
                                            color: '#1a1a1a',
                                            marginTop: '16px',
                                            textAlign: 'center',
                                            fontSize: position === 'active' ? '1.25rem' : '1rem',
                                            transition: 'font-size 0.3s ease'
                                        }}
                                    >
                                        {slide.title}
                                    </Typography>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Indicators */}
                    <div className="absolute -bottom-12 flex gap-3">
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-gray-800' : 'w-2 bg-gray-300'}`}
                            />
                        ))}
                    </div>

                </Box>
            </Container>
        </section>
    );
}
