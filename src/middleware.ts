import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Public routes that don't require authentication
    // We allow /auth/callback for the magic link flow
    // We allow /logos/* for images
    // We allow /manifest.json and icons for PWA
    const isPublicRoute =
        req.nextUrl.pathname === '/' ||
        req.nextUrl.pathname.startsWith('/auth/') ||
        req.nextUrl.pathname.startsWith('/logos/');

    // If user is not signed in and the current path is not public, redirect to /
    if (!session && !isPublicRoute) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
    }

    // If user is signed in and visits login page, redirect to dashboard
    if (session && req.nextUrl.pathname === '/') {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        return NextResponse.redirect(redirectUrl)
    }

    return res
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
