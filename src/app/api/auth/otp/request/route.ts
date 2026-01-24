import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateOTP, hashOTP, sendOTP } from '@/lib/otp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find or create user
        let user = await User.findOne({ email }).select('+otp +otpExpires');

        // Check rate limiting - prevent spam
        if (user?.otpExpires && new Date() < user.otpExpires) {
            const remainingTime = Math.ceil((user.otpExpires.getTime() - Date.now()) / 1000 / 60);
            if (remainingTime > 8) { // If less than 2 minutes passed since last request
                return NextResponse.json(
                    { error: `Please wait ${remainingTime} minutes before requesting a new OTP` },
                    { status: 429 }
                );
            }
        }

        if (!user) {
            // Create new user for OTP login
            user = await User.create({
                email,
                name: email.split('@')[0], // Use email prefix as default name
                role: 'user',
                authProvider: 'otp',
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        // Store OTP with expiration (10 minutes)
        user.otp = hashedOTP;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send OTP via email
        try {
            await sendOTP(email, otp, user.name);
        } catch (emailError: any) {
            console.error('Failed to send OTP email:', emailError);
            return NextResponse.json(
                { error: emailError.message || 'Failed to send OTP email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully to your email',
            email,
        });
    } catch (error: unknown) {
        console.error('OTP request error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
