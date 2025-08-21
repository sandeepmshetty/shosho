import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    axios.post(`${API_BASE_URL}/auth/login`, credentials),
  
  register: (userData: { email: string; firstName: string; lastName: string; password: string }) =>
    axios.post(`${API_BASE_URL}/auth/register`, userData),
  
  getProfile: (token: string) =>
    axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  
  logout: () =>
    axios.post(`${API_BASE_URL}/auth/logout`),
};

export { authAPI };
