import { Container } from '@mui/material';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ footerData }: { footerData: any }) {
    if (!footerData) return null;

    return (
        <footer
            className="border-t bg-gray-50/50 backdrop-blur-sm"
            style={{
                borderColor: '#e2e8f0',
            }}
        >
            <Container maxWidth="xl">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 md:py-6 gap-4 md:gap-0">
                    <div className="flex items-center gap-4 md:gap-6 flex-col md:flex-row text-center md:text-left">
                        <a href="#" className="block">
                            <Image
                                src="/logo-dark.png"
                                alt={footerData.logoAlt || "SDEVX Technology"}
                                width={800}
                                height={200}
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </a>
                        <p className="text-sm text-gray-500">
                            {footerData.copyright}
                        </p>
                    </div>

                    <div className="flex gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {footerData.socialLinks.map((link: any, index: number) => (
                            <a
                                key={index}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-[var(--primary-color)] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </Container>
        </footer>
    );
}
