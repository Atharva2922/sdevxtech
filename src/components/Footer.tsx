import { Container } from '@mui/material';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ footerData }: { footerData: any }) {
    if (!footerData) return null;

    return (
        <footer
            className="border-t bg-gray-100"
            style={{
                borderColor: '#e2e8f0',
                paddingTop: '80px',
                paddingBottom: '48px',
            }}
        >
            <Container maxWidth="lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-12 mb-12">
                    {/* Column 1: Logo & Vision (Span 2) */}
                    <div className="md:col-span-2 space-y-4">
                        <a href="#" className="block inline-block">
                            <Image
                                src="/logo-dark.png"
                                alt={footerData.logoAlt || "SDEVX Technology"}
                                width={800}
                                height={200}
                                className="h-8 md:h-10 w-auto object-contain mb-4"
                            />
                        </a>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Building the future of digital experiences with precision, creativity, and cutting-edge technology.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Services', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase().split(' ')[0]}`} className="text-gray-600 hover:text-[var(--primary-color)] text-[15px] transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Social */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Connect</h4>
                        <div className="flex flex-col space-y-3">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {footerData.socialLinks.map((link: any, index: number) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="text-gray-600 hover:text-[var(--primary-color)] text-[15px] transition-colors flex items-center gap-2"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        {footerData.copyright}
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-gray-400 hover:text-gray-600">Privacy Policy</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-gray-600">Terms of Service</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
