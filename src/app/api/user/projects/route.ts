import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const projects = await Project.find({ userId: payload.userId })
            .sort({ createdAt: -1 });

        return NextResponse.json({ projects });

    } catch (error: any) {
        console.error('Fetch User Projects Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects', details: error.message },
            { status: 500 }
        );
    }
}
