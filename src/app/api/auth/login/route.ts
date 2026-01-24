import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { createLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            await createLog({
                action: 'Login Failed',
                details: `Failed login attempt for email: ${email}`,
                type: 'warning',
                user: 'Unknown',
                source: 'Auth'
            });
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await createLog({
                action: 'Login Failed',
                details: `Invalid password for user: ${user.name} (${email})`,
                type: 'warning',
                user: user.name,
                source: 'Auth'
            });
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = await generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Log successful login
        await createLog({
            action: 'User Login',
            details: `User ${user.name} logged in successfully`,
            type: 'info',
            user: user.name,
            source: 'Auth'
        });

        // Check if profile is completed (has at least phone or company filled)
        const isProfileComplete = !!(user.phone || user.company || user.address || user.department);

        // Create response with token in httpOnly cookie
        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                isProfileComplete, // Add profile completion status
                token // Also send in response body for localStorage option
            },
            { status: 200 }
        );

        // Set httpOnly cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed', details: error.message },
            { status: 500 }
        );
    }
}
