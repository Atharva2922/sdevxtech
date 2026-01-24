import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();

        // Get all users (for debugging - remove password)
        const users = await User.find({}).select('-password');
        const count = await User.countDocuments();

        return NextResponse.json({
            success: true,
            count,
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                createdAt: u.createdAt
            }))
        });
    } catch (error: unknown) {
        console.error('Debug users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
