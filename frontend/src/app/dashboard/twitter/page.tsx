'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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

interface TwitterAccount {
  id: string;
  username: string;
  platformId: string;
  status: 'active' | 'inactive' | 'revoked' | 'error';
}

interface NewTwitterUser {
  id: string;
  username: string;
  platformId: string;
  status: string;
}

interface TwitterAnalytics {
  organic_metrics: {
    impression_count: number;
    like_count: number;
    reply_count: number;
    retweet_count: number;
  }[];
}

export default function TwitterDashboard() {
  const [accounts, setAccounts] = useState<TwitterAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<TwitterAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [newUser, setNewUser] = useState<NewTwitterUser | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await authenticatedFetch(
        apiEndpoints.socialAccounts.twitter.list
      );
      const data = await response.json();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching Twitter accounts:', error);
    }
  }, [selectedAccount]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleTwitterLogin = async () => {
    try {
      setConnecting(true);

      console.log(
        'Making API call to:',
        apiEndpoints.socialAccounts.twitter.auth
      );
      const response = await authenticatedFetch(
        apiEndpoints.socialAccounts.twitter.auth
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data.authUrl) {
        throw new Error('No authUrl received from server');
      }

      // Open popup window for OAuth
      const popup = window.open(
        data.authUrl,
        'twitterAuth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for popup closure and OAuth completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setConnecting(false);
          // Refresh accounts list after potential connection
          fetchAccounts();
        }
      }, 1000);

      // Listen for messages from popup (if OAuth completes successfully)
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          setConnecting(false);
          // Set the new user data for display
          if (event.data.user) {
            setNewUser(event.data.user);
            // Auto-clear the new user notification after 5 seconds
            setTimeout(() => setNewUser(null), 5000);
          }
          // Refresh accounts to show newly connected account
          fetchAccounts();
          window.removeEventListener('message', messageListener);
        } else if (event.data.type === 'TWITTER_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          setConnecting(false);
          console.error('Twitter authentication error:', event.data.error);
          window.removeEventListener('message', messageListener);
        }
      };

      window.addEventListener('message', messageListener);
    } catch (error) {
      console.error('Error initiating Twitter login:', error);
      setConnecting(false);
      alert(
        `Failed to connect X account: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const fetchAnalytics = async (accountId: string) => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(
        apiEndpoints.socialAccounts.twitter.analytics(accountId)
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchAnalytics(selectedAccount);
    }
  }, [selectedAccount]);

  return (
    <div className="container mx-auto p-4">
      {/* New User Connected Notification */}
      {newUser && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">
                X Account Connected Successfully!
              </h3>
              <p className="text-sm text-green-600">
                Welcome <strong>@{newUser.username}</strong>! Your account has
                been connected and is ready to use.
              </p>
            </div>
            <button
              onClick={() => setNewUser(null)}
              className="flex-shrink-0 text-green-400 hover:text-green-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">X Dashboard</h1>
        <Button
          onClick={handleTwitterLogin}
          disabled={connecting}
          className="bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connecting ? 'Connecting...' : 'Connect X Account'}
        </Button>
      </div>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Connected Accounts</h2>
            <div className="flex flex-col gap-2">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  className={`p-4 rounded-lg border ${
                    selectedAccount === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">@{account.username}</div>
                  <div className="text-sm text-gray-500">{account.status}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedAccount && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Analytics Overview</h2>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-gray-500">Loading analytics...</div>
                </div>
              ) : analytics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500">Impressions</div>
                    <div className="text-2xl font-bold">
                      {analytics.organic_metrics[0]?.impression_count ?? 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500">Likes</div>
                    <div className="text-2xl font-bold">
                      {analytics.organic_metrics[0]?.like_count ?? 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500">Replies</div>
                    <div className="text-2xl font-bold">
                      {analytics.organic_metrics[0]?.reply_count ?? 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-500">Retweets</div>
                    <div className="text-2xl font-bold">
                      {analytics.organic_metrics[0]?.retweet_count ?? 0}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    No analytics data available
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No X accounts connected yet.</p>
          <p className="text-sm text-gray-400">
            Click the button above to connect your first X account.
          </p>
        </div>
      )}
    </div>
  );
}
