import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthURL } from '@/lib/google-auth';

export async function GET(req: NextRequest) {
    try {
        // Get the origin from the request to ensure correct redirect URI
        const origin = req.nextUrl.origin;
        console.log('OAuth Request Origin:', origin);

        const authUrl = getGoogleAuthURL(origin);
        console.log('Generated Redirect URI being sent to Google:', `${origin}/api/auth/google/callback`);

        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.redirect('/login?error=google_auth_failed');
    }
}
