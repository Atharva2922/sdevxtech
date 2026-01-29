import Link from 'next/link';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ColorPicker from '@/components/ColorPicker';
import connectDB from '@/lib/db';
import Content from '@/models/Content';
import fs from 'fs/promises';
import path from 'path';

// Helper to get initial data if DB is empty
async function getInitialData() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src/data/content.json');
    const fileBuffer = await fs.readFile(dataFilePath);
    return JSON.parse(fileBuffer.toString());
  } catch (e) {
    console.error('Error reading local content.json:', e);
    return null;
  }
}

async function getContent() {
  await connectDB();
  try {
    let content = await Content.findOne({}).lean(); // lean() for POJO
    if (!content) {
      const initialData = await getInitialData();
      if (initialData) {
        // We create it but don't wait for it if we don't want to block, 
        // but for first load we should probably wait or just use the JSON.
        // Let's create it and return it.
        content = await Content.create(initialData);
        // content is a document, convert to object if needed, but here we can just use it.
        // If create returns a mongoose doc, we might need toJSON/toObject for Props if strictly passing to client components.
        // But Next.js handles JSON-serializable objects fine.
        // Safety: Convert to JSON to remove mongoose methods
        content = JSON.parse(JSON.stringify(content));
      }
    } else {
      content = JSON.parse(JSON.stringify(content));
    }
    return content;
  } catch (e) {
    console.error("Failed to fetch content:", e);
    // Fallback to local file if DB fails
    return await getInitialData();
  }
}

export default async function Home() {
  const data = await getContent();

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Under Maintenance</h1>
          <p className="text-gray-600">We are currently updating our content. Please check back soon.</p>
          <Link href="/login" className="text-blue-600 hover:underline mt-4 block">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header navItems={data.header?.navItems || []} />
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
