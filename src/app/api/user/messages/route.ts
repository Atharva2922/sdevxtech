import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch messages for the user
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

        // Fetch messages where user is sender OR recipient
        // But for now, let's assume 'messages' section shows 'inbox' (sent to user) and 'sent' (from user).
        // Let's just fetch ALL messages involving this user for a chat-like history or list.
        const messages = await Message.find({
            $or: [
                { toUserId: payload.userId },
                { fromUserId: payload.userId }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('fromUserId', 'name image') // Populate sender info
            .populate('toUserId', 'name image');  // Populate recipient info

        return NextResponse.json({ messages });

    } catch (error: any) {
        console.error('Fetch Messages Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages', details: error.message },
            { status: 500 }
        );
    }
}

// POST: Send a new message
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
        const { subject, message, toUserId } = body;

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required' },
                { status: 400 }
            );
        }

        // For now, if no recipient is specified, maybe default to an Admin?
        // Or handle it generically. The UI might send to "Support".
        // Let's assume for this "User Dashboard", messages go to the "System" or an Admin if not specified.
        // Since we don't have a hardcoded Admin ID easily available here without query, 
        // We'll require a recipient OR handle it in a specific 'Support' flow.
        // For simplicity: If no toUserId, we might store it as a 'General Inquiry' (no specific recipient yet)
        // OR we just require it. Let's make toUserId optional and if missing, it's a "general" message.

        const newMessage = await Message.create({
            from: 'user', // Enum in model
            fromUserId: payload.userId,
            toUserId: toUserId || null, // Null means general/admin
            subject,
            message,
            isRead: false
        });

        return NextResponse.json({
            message: 'Message sent successfully',
            data: newMessage
        });

    } catch (error: any) {
        console.error('Send Message Error:', error);
        return NextResponse.json(
            { error: 'Failed to send message', details: error.message },
            { status: 500 }
        );
    }
}
