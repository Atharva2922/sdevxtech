import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ColorPicker from '@/components/ColorPicker';

async function getData() {
  // Use relative URL for API calls to work in both development and production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/content`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Home() {
  let data;
  try {
    data = await getData();
  } catch (error) {
    console.error('Error fetching content:', error);
    // Return empty placeholders or handle error appropriately
    return <div>Error loading content</div>;
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
