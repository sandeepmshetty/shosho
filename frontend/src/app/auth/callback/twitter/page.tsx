'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiEndpoints } from '@/lib/api';

// Helper function to make authenticated API calls
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

export default function TwitterCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'TWITTER_AUTH_ERROR',
              error: error,
            },
            window.location.origin
          );
        }
        return;
      }

      if (!code || !state) {
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'TWITTER_AUTH_ERROR',
              error: 'Missing authorization code or state',
            },
            window.location.origin
          );
        }
        return;
      }

      try {
        // Call backend callback endpoint with the authorization code
        const callbackUrl = new URL(
          apiEndpoints.socialAccounts.twitter.callback
        );
        callbackUrl.searchParams.set('code', code);
        callbackUrl.searchParams.set('state', state);

        const response = await authenticatedFetch(callbackUrl.toString(), {
          method: 'GET', // Changed to GET since we're passing params in URL
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Send success message to parent window with user data
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'TWITTER_AUTH_SUCCESS',
              user: data,
            },
            window.location.origin
          );
        }
      } catch (error) {
        console.error('Error handling Twitter callback:', error);
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'TWITTER_AUTH_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            window.location.origin
          );
        }
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <p className="text-gray-600">Processing your X account connection...</p>
        <p className="text-sm text-gray-400 mt-2">
          This window will close automatically.
        </p>
      </div>
    </div>
  );
}
