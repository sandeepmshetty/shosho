import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Also set the cookie for SSR
        document.cookie = `token=${token}; path=/`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Check for token in response data or headers
    const token = response.data?.accessToken || response.headers['authorization']?.replace('Bearer ', '');
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      document.cookie = `token=${token}; path=/`;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      // Clear auth state and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    // Handle 204 response by immediately fetching the profile
    if (response.status === 204) {
      return api.get('/auth/profile');
    }
    return response;
  },
  
  register: (userData: { email: string; firstName: string; lastName: string; password: string }) =>
    api.post('/auth/register', userData),
  
  getProfile: () => api.get('/auth/profile'),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    return api.post('/auth/logout');
  }
};
