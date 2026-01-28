import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/', '/landing'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If accessing login/register while authenticated, redirect to dashboard
    if ((pathname === '/login' || pathname === '/register') && token) {
        const payload = await verifyToken(token);
        if (payload) {
            const redirectUrl = payload.role === 'admin' ? '/admin' : '/user';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
    }

    // Protected routes
    if (!isPublicRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyToken(token);
        if (!payload) {
            // Invalid token, redirect to login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth-token');
            return response;
        }

        // Check role-based access
        if (pathname.startsWith('/admin') && payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/user', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
