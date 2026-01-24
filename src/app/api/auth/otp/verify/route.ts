import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyOTP, isOTPExpired } from '@/lib/otp';
import { generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                { error: 'OTP must be 6 digits' },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email }).select('+otp +otpExpires');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.otp || !user.otpExpires) {
            return NextResponse.json(
                { error: 'No OTP found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check if OTP expired
        if (isOTPExpired(user.otpExpires)) {
            // Clear expired OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        const isValid = verifyOTP(otp, user.otp);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid OTP. Please check and try again.' },
                { status: 400 }
            );
        }

        // OTP is valid - clear it and mark email as verified
        user.otp = undefined;
        user.otpExpires = undefined;
        user.emailVerified = true;
        await user.save();

        // Generate JWT token
        const token = await generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Return user data and token
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
            },
        });

        // Set token in cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
    } catch (error: unknown) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}
