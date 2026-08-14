import axios from 'axios';

// Create a configured axios instance for dashboard requests
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardApi = {
  getProfile: async (signal) => {
    const res = await apiClient.get('/users/profile', { signal });
    return res.data.data.user;
  },
  
  getWishlist: async (signal) => {
    const res = await apiClient.get('/wishlist', { signal });
    return res.data.data.wishlist;
  },
  
  getApplications: async (signal) => {
    const res = await apiClient.get('/applications', { signal });
    return res.data.data.applications;
  },
  
  getScholarships: async (signal) => {
    // Only fetch 1 item to get total count efficiently
    const res = await apiClient.get('/scholarships/recommend?limit=1', { signal });
    return { 
      items: res.data.data.scholarships, 
      total: res.data.data.pagination.total 
    };
  },
  
  getRecommendedCountries: async (signal) => {
    const res = await apiClient.get('/countries/recommend', { signal });
    return res.data.data.countries;
  }
};
