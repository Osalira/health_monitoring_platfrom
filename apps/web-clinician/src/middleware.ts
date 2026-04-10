import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSupabaseSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

// Paths that don't require auth
const PUBLIC_PATHS = ['/login', '/api/health'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.includes(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for public paths and static assets
  if (isPublicPath(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return intlMiddleware(request);
  }

  // Check if Supabase env vars are configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    // No Supabase configured — fall through to i18n only (local dev without Supabase)
    return intlMiddleware(request);
  }

  // Refresh Supabase session
  const { user, response } = await updateSupabaseSession(request);

  if (!user) {
    // Not authenticated — redirect to login
    const locale = pathname.match(/^\/(en|fr)/)?.[1] ?? 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated — apply i18n middleware
  const intlResponse = intlMiddleware(request);

  // Merge Supabase cookies into the i18n response
  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(en|fr)/:path*'],
};
