import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
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

        const userId = payload.userId;

        // Fetch Stats
        // const totalProjects = await Project.countDocuments({ userId }); // Unused
        const activeProjects = await Project.countDocuments({ userId, status: { $in: ['In Progress', 'Planning'] } });
        const completedProjects = await Project.countDocuments({ userId, status: 'Completed' });

        // Mock pending tasks/messages for now as we don't have those models yet
        const pendingTasks = 0;
        const unreadMessages = 0;

        return NextResponse.json({
            stats: [
                { label: 'Active Projects', value: activeProjects.toString(), color: '#667eea', change: 'Current' },
                { label: 'Pending Tasks', value: pendingTasks.toString(), color: '#f59e0b', change: 'Action Required' },
                { label: 'Completed', value: completedProjects.toString(), color: '#10b981', change: 'All Time' },
                { label: 'Messages', value: unreadMessages.toString(), color: '#3b82f6', change: 'Unread' },
            ]
        });

    } catch (error: unknown) {
        console.error('Fetch User Stats Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
