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

      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error initiating Twitter login:', error);
      alert('Failed to connect X account. Please try again.');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">X Dashboard</h1>
        <Button
          onClick={handleTwitterLogin}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Connect X Account
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
