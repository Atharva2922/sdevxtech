import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { createLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        // Initialize Firebase Admin if not already working (will log warning if env missing)
        if (!adminAuth) {
            console.error('Firebase Admin not initialized. Check server logs.');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Verify the ID token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { uid, email, phone_number, picture, name } = decodedToken;

        await connectDB();

        // Strategy to find user:
        // 1. By Email (if available)
        // 2. By Phone (if available)
        // 3. By UID (if we stored it - but we don't have a firebaseUid field yet, maybe we should add one or just use googleId/email)

        let user;
        const emailToSearch = email || (phone_number ? `${phone_number}@phone.firebase` : `${uid}@firebase.app`);

        if (email) {
            user = await User.findOne({ email });
        } else if (phone_number) {
            user = await User.findOne({ phone: phone_number });
            // If found by phone, ensure we have an email strategy or it's the same user
        }

        if (!user) {
            // Check if we can find by emailToSearch (placeholder)
            user = await User.findOne({ email: emailToSearch });
        }

        if (user && user.isDisabled) {
            return NextResponse.json(
                { error: 'Account disabled. Please contact support.' },
                { status: 403 }
            );
        }

        if (!user) {
            // Create new user
            console.log(`Creating new Firebase user: ${emailToSearch}`);
            user = await User.create({
                name: name || (phone_number ? `User ${phone_number.slice(-4)}` : 'New User'),
                email: emailToSearch,
                phone: phone_number || '',
                image: picture || '',
                role: 'user',
                authProvider: 'firebase',
                emailVerified: !!email, // Firebase verifies emails/phones
            });

            await createLog({
                action: 'User Signup',
                details: `New user signup via Firebase: ${user.email}`,
                type: 'info',
                user: user.name,
                source: 'Auth'
            });
        } else {
            // Update existing user info if needed
            // e.g. update image if changed, or merge phone
            if (!user.image && picture) user.image = picture;
            if (!user.phone && phone_number) user.phone = phone_number;
            // Update verification status
            if (!user.emailVerified && email) user.emailVerified = true;

            await user.save();
        }

        // Generate our JWT Session Token
        const token = await generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Create response with cookie
        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image
                },
                token
            },
            { status: 200 }
        );

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error: any) {
        console.error('Firebase Login Error:', error);
        return NextResponse.json(
            { error: 'Authentication failed', details: error.message },
            { status: 401 }
        );
    }
}
