import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import ThemeRegistry from '@/components/ThemeRegistry';
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SDEVX Technology | Premium Web Design",
  description: "SDEVX Technology: Crafting beautiful, functional, and responsive websites to transform your digital footprint.",
};

async function getSettings() {
  try {
    const res = await fetch('http://localhost:3000/api/content', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.settings;
    }
  } catch (error) {
    console.error('Failed to fetch settings', error);
  }
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const themeColor = settings?.themeColor || '#6366f1';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`} style={{ fontFamily: 'var(--font-outfit)' }}>
        <ThemeRegistry themeColor={themeColor}>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
