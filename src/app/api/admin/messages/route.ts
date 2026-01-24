import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch all messages for admin (or specifically sent to null/admin)
export async function GET(req: NextRequest) {
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

        // Fetch messages sent by users (from 'user') or specifically to admin
        // We can just fetch all messages where 'toUserId' is null (System) OR query populated names.
        // A better approach for "Client Msgs" is to show threads started by users.
        const messages = await Message.find({ from: 'user' }) // Filter by sender type 'user'
            .sort({ createdAt: -1 })
            .populate('fromUserId', 'name email image')
            .limit(100); // Limit for performance

        return NextResponse.json({ messages });

    } catch (error: any) {
        console.error('Admin Messages Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages', details: error.message },
            { status: 500 }
        );
    }
}
