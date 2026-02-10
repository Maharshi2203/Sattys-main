import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // -------------------------------------------------------------------------
    // 2️⃣ FRONTEND SECURITY: Implement strict HTTP Security Headers
    // -------------------------------------------------------------------------
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://*;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()

    response.headers.set('Content-Security-Policy', cspHeader)
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // -------------------------------------------------------------------------
    // 1️⃣ AUTHENTICATION & AUTHORIZATION: Secure Role-Based Access Control
    // -------------------------------------------------------------------------
    const path = request.nextUrl.pathname
    const token = request.cookies.get('admin_token')?.value

    // Protect all /admin routes
    if (path.startsWith('/admin')) {
        let verifiedUser = null
        if (token) {
            verifiedUser = await verifyToken(token)
        }

        // Handle login page specifically
        if (path === '/admin/login') {
            // IF ALREADY AUTHENTICATED -> Redirect to Dashboard
            if (verifiedUser) {
                return NextResponse.redirect(new URL('/admin/products', request.url))
            }
            // ELSE -> Allow access to login page
            return response
        }

        // Protect other admin routes
        if (!verifiedUser) {
            const loginUrl = new URL('/admin/login', request.url)
            // Optional: Preserve redirect logic if needed
            // loginUrl.searchParams.set('from', path)
            return NextResponse.redirect(loginUrl)
        }

        // Check if verified user has admin role (defense in depth)
        // Note: verifyToken already decodes the payload, you can check roles here if added to token
        // e.g. if (verifiedUser.role !== 'admin') return NextResponse.redirect(...)
    }

    return response
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
}
