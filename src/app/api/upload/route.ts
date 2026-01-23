import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        // Authenticate user
        const token = req.cookies.get('auth-token')?.value;
        if (!token || !(await verifyToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.' }, { status: 400 });
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max size is 2MB.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if directory exists
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `profile-${uniqueSuffix}.${extension}`;
        const filepath = join(uploadDir, filename);

        // Save file
        await writeFile(filepath, buffer);

        // Return public URL
        const imageUrl = `/uploads/profiles/${filename}`;

        return NextResponse.json({
            success: true,
            imageUrl
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
    }
}
