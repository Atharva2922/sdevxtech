import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, dueDate, type } = body;

        if (!name || !description || !dueDate) {
            return NextResponse.json(
                { error: 'Name, description, and due date are required' },
                { status: 400 }
            );
        }

        const newProject = await Project.create({
            userId: payload.userId,
            name,
            description,
            status: 'Planning', // Default status for new requests
            progress: 0,
            startDate: new Date(),
            dueDate: new Date(dueDate),
            team: 'Unassigned',
            deliverables: [],
            additionalDetails: {
                type: type || 'Custom Project'
            }
        });

        return NextResponse.json({
            message: 'Project requested successfully',
            project: newProject
        });

    } catch (error: unknown) {
        console.error('Project Request Error:', error);
        return NextResponse.json(
            { error: 'Failed to request project', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
