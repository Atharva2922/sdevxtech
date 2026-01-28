import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Parse the JSON string from environment variable
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (error) {
            console.error('Firebase Admin Request Error: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', error);
        }
    } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found in environment variables. Firebase Admin not initialized correctly.");
        // Fallback or just don't initialize if missing, but we need it for verification.
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
