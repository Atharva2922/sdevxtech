import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OtpToken from "@/models/OtpToken";
import User from "@/models/User";
import { hashOtp, isOtpExpired } from "@/lib/otp";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        await connectDB();

        // Find the OTP record
        const otpRecord = await OtpToken.findOne({ email });

        if (!otpRecord) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // Check if expired
        if (isOtpExpired(otpRecord.expiresAt)) {
            await OtpToken.deleteOne({ _id: otpRecord._id });
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // Verify hash
        const hashedInput = hashOtp(code);
        if (hashedInput !== otpRecord.code) {
            return NextResponse.json({ error: "Invalid code" }, { status: 400 });
        }

        // OTP is valid. Delete it to prevent reuse.
        await OtpToken.deleteOne({ _id: otpRecord._id });

        // Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if not exists (Auto-signup via OTP)
            // Or return error if you only want to allow existing users
            console.log(`Creating new User via OTP: ${email}`);
            user = await User.create({
                name: email.split('@')[0], // Default name from email
                email,
                role: 'user',
                authProvider: 'otp',
                emailVerified: true
            });
        } else {
            // Update emailVerified if not already
            if (!user.emailVerified) {
                user.emailVerified = true;
                await user.save();
            }
        }

        // Generate Session Token
        const token = await generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            },
            token
        });

        // Set Cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
