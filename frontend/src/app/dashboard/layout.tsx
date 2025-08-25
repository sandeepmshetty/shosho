'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/auth/login';
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'X', href: '/dashboard/twitter', icon: '❌' },
    {
      name: 'Facebook',
      href: '/dashboard/facebook',
      icon: '📘',
      disabled: true,
    },
    {
      name: 'Instagram',
      href: '/dashboard/instagram',
      icon: '📷',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-xl font-semibold text-gray-900"
              >
                SHO-SHO
              </Link>
              <div className="hidden md:flex space-x-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.disabled ? '#' : item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={(e) => item.disabled && e.preventDefault()}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
