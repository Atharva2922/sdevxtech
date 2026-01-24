import { NextRequest, NextResponse } from 'next/server';
import { getGoogleUserInfo } from '@/lib/google-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(
                new URL(`/login?error=google_auth_cancelled`, req.url)
            );
        }

        if (!code) {
            return NextResponse.redirect(
                new URL(`/login?error=no_code_provided`, req.url)
            );
        }

        // Get user info from Google
        const googleUser = await getGoogleUserInfo(code);

        if (!googleUser.email) {
            return NextResponse.redirect(
                new URL(`/login?error=no_email_from_google`, req.url)
            );
        }

        await connectDB();

        // Find or create user
        let user = await User.findOne({ email: googleUser.email });

        if (user) {
            // Update existing user with Google info
            if (!user.googleId) {
                user.googleId = googleUser.id;
                user.authProvider = 'google';
            }
            if (googleUser.picture && !user.image) {
                user.image = googleUser.picture;
            }
            user.emailVerified = googleUser.verified_email || true;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                name: googleUser.name || googleUser.email.split('@')[0],
                email: googleUser.email,
                image: googleUser.picture || '',
                role: 'user',
                authProvider: 'google',
                googleId: googleUser.id,
                emailVerified: true,
            });
        }

        // Generate JWT token
        const token = await generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Create response with redirect
        const response = NextResponse.redirect(
            new URL('/user', req.url)
        );

        // Set token in cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        // Also set user data in cookie for client-side access
        response.cookies.set('user', JSON.stringify({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
        });

        return response;
    } catch (error: unknown) {
        console.error('Google callback error:', error);
        return NextResponse.redirect(
            new URL(`/login?error=google_auth_failed`, req.url)
        );
    }
}
