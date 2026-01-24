import { google } from 'googleapis';

// Create OAuth2 client dynamically based on the request
export function createOAuth2Client(redirectUri: string) {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUri
    );
}

// Generate Google OAuth URL with dynamic redirect URI
export function getGoogleAuthURL(origin: string) {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const oauth2Client = createOAuth2Client(redirectUri);

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
    });
}

// Get user info from Google with dynamic redirect URI
export async function getGoogleUserInfo(code: string, redirectUri: string) {
    const oauth2Client = createOAuth2Client(redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    return {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        verified_email: data.verified_email,
    };
}

