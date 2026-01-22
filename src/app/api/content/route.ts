import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Content from '@/models/Content';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src/data/content.json');

async function getInitialData() {
    try {
        const fileBuffer = await fs.readFile(dataFilePath);
        return JSON.parse(fileBuffer.toString());
    } catch (e) {
        console.error('Error reading local content.json:', e);
        return null; // Should ideally have a fallback or error
    }
}

export async function GET() {
    await connectDB();

    try {
        let content = await Content.findOne({});

        if (!content) {
            console.log('No data in MongoDB. Seeding from content.json...');
            const initialData = await getInitialData();
            if (initialData) {
                content = await Content.create(initialData);
                console.log('Database seeded successfully.');
            }
        }

        return NextResponse.json(content);
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const body = await request.json();

        // Update the existing document or create one if it somehow doesn't exist
        const updatedContent = await Content.findOneAndUpdate({}, body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });

        revalidatePath('/', 'layout'); // Invalidate cache
        return NextResponse.json({ message: 'Data updated successfully', data: updatedContent });
    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}
