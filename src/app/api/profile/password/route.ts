import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// POST - Change user password
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Get token from cookie
        const token = req.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get password data from request
        const { currentPassword, newPassword } = await req.json();

        // Validate input
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'New password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Fetch user from database (with password)
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error: any) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { error: 'Failed to change password', details: error.message },
            { status: 500 }
        );
    }
}
