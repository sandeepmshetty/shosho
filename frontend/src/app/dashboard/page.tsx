"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { logout, fetchUserProfile } from "@/store/slices/authSlice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, profileFetched, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Handle authentication and profile fetching
    const handleAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!isAuthenticated && !token) {
        const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
        router.replace(`/auth/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
      } else if (isAuthenticated && !profileFetched) {
        dispatch(fetchUserProfile());
      }
    };

    handleAuth();
  }, [isAuthenticated, profileFetched, router, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/auth/login';
  };

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Social Media Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard Coming Soon
              </h2>
              <p className="text-gray-600">
                Your social media management dashboard will appear here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
