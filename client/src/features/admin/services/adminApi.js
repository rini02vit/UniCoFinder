import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
  getAnalytics: async (range = '30d') => {
    const response = await apiClient.get(`/analytics?range=${range}`);
    return response.data;
  }
};
