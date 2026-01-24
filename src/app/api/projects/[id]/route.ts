import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// PUT: Update project
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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
        const { id } = params;

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Only Admin or the project owner can update
        if (payload.role !== 'admin' && project.userId.toString() !== payload.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        return NextResponse.json({ project: updatedProject });
    } catch (error: unknown) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: Delete project
export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        // Only Admin can delete projects usually, or maybe owner too? 
        // Let's restrict DELETE to Admin only for safety in Admin Panel context
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
        }

        const { id } = params;
        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
