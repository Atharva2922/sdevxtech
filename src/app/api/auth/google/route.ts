import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthURL } from '@/lib/google-auth';

export async function GET(req: NextRequest) {
    try {
        // Get the origin from the request to ensure correct redirect URI
        const origin = req.nextUrl.origin;
        const authUrl = getGoogleAuthURL(origin);
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.redirect('/login?error=google_auth_failed');
    }
}
