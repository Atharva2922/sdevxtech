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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use default theme values - settings can be fetched client-side if needed
  const themeColor = '#6366f1';
  const secondaryColor = '#d946ef';
  const backgroundColor = '#ffffff';
  const paperColor = '#f8fafc';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`} style={{ fontFamily: 'var(--font-outfit)' }}>
        <ThemeRegistry
          themeColor={themeColor}
          secondaryColor={secondaryColor}
          backgroundColor={backgroundColor}
          paperColor={paperColor}
        >
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
