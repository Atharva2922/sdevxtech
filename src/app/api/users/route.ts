import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { createLog } from '@/lib/logger';


export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Check authentication and admin role
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            console.log('GET /api/users: No token');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            console.log('GET /api/users: Forbidden', payload?.role);
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch users (exclude password)
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        console.log(`GET /api/users: Found ${users.length} users`);

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        // Check authentication and admin role
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();

        // Basic validation
        if (!body.email || !body.password || !body.name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: body.email });
        if (userExists) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create user
        const user = await User.create(body);

        await createLog({
            action: 'User Created',
            details: `Created new user: ${user.name} (${user.email})`,
            type: 'info',
            user: payload.email, // Admin email
            source: 'Admin Panel'
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json({ user: userResponse }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
    }
}
