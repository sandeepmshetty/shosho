'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchUserProfile } from '@/store/slices/authSlice';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, profileFetched, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Handle authentication and profile fetching
    const handleAuth = async () => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!isAuthenticated && !token) {
        const currentUrl =
          typeof window !== 'undefined'
            ? window.location.pathname
            : '/dashboard';
        router.replace(
          `/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`
        );
      } else if (isAuthenticated && !profileFetched) {
        dispatch(fetchUserProfile());
      }
    };

    handleAuth();
  }, [isAuthenticated, profileFetched, router, dispatch]);

  // Only show loading when actively fetching profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (isAuthenticated && profileFetched && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Error loading user profile. Please try logging in again.
        </div>
      </div>
    );
  }

  // Don't render anything while checking authentication
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* X Integration Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-black p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">X</h3>
                <p className="text-sm text-gray-500">
                  Manage X accounts & analytics
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Connect multiple X accounts, schedule posts, and track your
              performance with detailed analytics.
            </p>
            <button
              onClick={() => router.push('/dashboard/twitter')}
              className="w-full bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Open X Dashboard
            </button>
          </div>

          {/* Facebook Integration Card (Placeholder) */}
          <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-800"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Facebook
                </h3>
                <p className="text-sm text-gray-500">Coming Soon</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Facebook integration will be available soon. Manage pages, posts,
              and insights.
            </p>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          {/* Instagram Integration Card (Placeholder) */}
          <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Instagram
                </h3>
                <p className="text-sm text-gray-500">Coming Soon</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Instagram integration will be available soon. Manage posts,
              stories, and insights.
            </p>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          {/* Analytics Overview Card */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Connected Accounts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-500">Total Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-500">Total Followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
