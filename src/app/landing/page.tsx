'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ColorPicker from '@/components/ColorPicker';
import PageLoader from '@/components/ui/PageLoader';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/content', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLoader message="Loading SDEVX..." />
    );
  }

  if (error || !data) {
    return <PageLoader message="Initializing Content..." />;
  }

  return (
    <>
      <Header navItems={data.header.navItems} />
      <main>
        <Hero heroData={data.hero} />
        <About aboutData={data.about} />
        <Services servicesData={data.services} />
        <Contact contactData={data.contact} />
      </main>
      <Footer footerData={data.footer} />
      <ColorPicker />
    </>
  );
}
