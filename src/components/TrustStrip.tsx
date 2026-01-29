'use client';

import { Container } from '@mui/material';
import Image from 'next/image';

const techs = [
    { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', dark: true },
    { name: 'Tailwind', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
];

export default function TrustStrip() {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <Container maxWidth="lg">
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
                        Powered by Modern Technologies
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {techs.map((tech) => (
                            <div key={tech.name} className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1">
                                <div className="relative w-12 h-12 md:w-14 md:h-14">
                                    <Image
                                        src={tech.src}
                                        alt={tech.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
