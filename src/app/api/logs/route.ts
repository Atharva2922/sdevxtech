import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Log from '@/models/Log';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const type = searchParams.get('type') || 'all';
        const search = searchParams.get('search') || '';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (type !== 'all') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { action: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } },
                { user: { $regex: search, $options: 'i' } },
                { source: { $regex: search, $options: 'i' } }
            ];
        }

        const logs = await Log.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({ logs });
    } catch (error: unknown) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
