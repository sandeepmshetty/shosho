import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check both cookie and Authorization header for token
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = ['/', '/about'].includes(request.nextUrl.pathname);
  const isDashboard = request.nextUrl.pathname === '/dashboard';

  // Add debug headers to response
  const response = NextResponse.next();
  response.headers.set('x-debug-token', token || 'no-token');
  response.headers.set('x-debug-is-auth-page', String(isAuthPage));
  response.headers.set('x-debug-is-public', String(isPublicPage));

  // If we're on the dashboard and have a token, allow access
  if (isDashboard && token) {
    return response;
  }

  // If we're on the dashboard without a token, redirect to login
  if (isDashboard && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', '/dashboard');
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated user tries to access auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to dashboard
  if (request.nextUrl.pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', '/dashboard');
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
