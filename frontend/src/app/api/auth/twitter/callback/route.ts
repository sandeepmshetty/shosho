import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // If there's an OAuth error, redirect to dashboard with error
  if (error) {
    return NextResponse.redirect(
      new URL('/dashboard/twitter?error=oauth_failed', request.url)
    );
  }

  // If missing required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard/twitter?error=missing_params', request.url)
    );
  }

  // Get the token from the request (this would typically be from cookies or session)
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL('/auth/login?callbackUrl=/dashboard/twitter', request.url)
    );
  }

  try {
    // Forward the callback to our backend
    const backendResponse = await fetch(
      `http://localhost:3001/social-accounts/twitter/callback?code=${code}&state=${state}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (backendResponse.ok) {
      return NextResponse.redirect(
        new URL('/dashboard/twitter?success=connected', request.url)
      );
    } else {
      throw new Error('Backend callback failed');
    }
  } catch (error) {
    console.error('Error handling Twitter callback:', error);
    return NextResponse.redirect(
      new URL('/dashboard/twitter?error=connection_failed', request.url)
    );
  }
}
