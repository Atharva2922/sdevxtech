import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch all messages for admin (or specifically sent to null/admin)
export async function GET() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Fetch ALL messages (both from users and admin replies)
        // This allows admin to see complete conversation threads
        const messages = await Message.find({}) // Fetch all messages
            .sort({ createdAt: -1 })
            .populate('fromUserId', 'name email image')
            .populate('toUserId', 'name email image')
            .limit(200); // Increased limit for complete threads

        return NextResponse.json({ messages });

    } catch (error: unknown) {
        console.error('Admin Messages Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
