const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiEndpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  socialAccounts: {
    twitter: {
      list: `${API_BASE_URL}/social-accounts/twitter`,
      auth: `${API_BASE_URL}/social-accounts/twitter/auth`,
      callback: `${API_BASE_URL}/social-accounts/twitter/callback`,
      analytics: (accountId: string) =>
        `${API_BASE_URL}/social-accounts/twitter/${accountId}/analytics`,
    },
  },
};

export default API_BASE_URL;
