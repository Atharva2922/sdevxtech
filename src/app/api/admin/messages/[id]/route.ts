import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// PATCH: Mark a message as read
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const body = await req.json();
        const { isRead } = body;

        const message = await Message.findByIdAndUpdate(
            id,
            { isRead },
            { new: true }
        );

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Message updated', data: message });

    } catch (error: unknown) {
        console.error('Update Message Error:', error);
        return NextResponse.json(
            { error: 'Failed to update message', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
