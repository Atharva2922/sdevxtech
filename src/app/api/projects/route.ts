import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch projects
export async function GET() {
    try {
        await connectDB();

        // Get user from JWT
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        let projects;

        // If admin, fetch all projects (with populated user info)
        if (payload.role === 'admin') {
            projects = await Project.find({})
                .sort({ createdAt: -1 })
                .populate('userId', 'name email');
        } else {
            // Fetch only user's projects
            projects = await Project.find({ userId: payload.userId })
                .sort({ createdAt: -1 });
        }

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create new project
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();

        // Check if creating for another user (Admin only)
        let targetUserId = payload.userId;
        if (body.userId && body.userId !== payload.userId) {
            if (payload.role !== 'admin') {
                return NextResponse.json({ error: 'Forbidden: Cannot create project for another user' }, { status: 403 });
            }
            targetUserId = body.userId;
        }

        // Create project
        const project = await Project.create({
            ...body,
            userId: targetUserId,
            status: body.status || 'Planning',
            progress: body.progress || 0
        });

        return NextResponse.json({ project }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
