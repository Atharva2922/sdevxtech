import { NextResponse } from 'next/server';
import { getGoogleAuthURL } from '@/lib/google-auth';

export async function GET() {
    try {
        const authUrl = getGoogleAuthURL();
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.redirect('/login?error=google_auth_failed');
    }
}
