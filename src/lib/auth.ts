import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    [key: string]: any; // Allow other standard JWT claims
}

export async function generateToken(payload: TokenPayload): Promise<string> {
    const { userId, email, role } = payload;
    return await new SignJWT({ userId, email, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as TokenPayload;
    } catch (error) {
        return null;
    }
}
