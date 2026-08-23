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
    // Fetch top 5 items for recommendations and upcoming deadline alerts
    const res = await apiClient.get('/scholarships/recommend?limit=5', { signal });
    return { 
      items: res.data.data.scholarships, 
      total: res.data.data.pagination.total 
    };
  },
  
  getRecommendedCountries: async (signal) => {
    const res = await apiClient.get('/countries/recommend', { signal });
    return res.data.data.countries;
  },

  getNotifications: async (signal) => {
    const res = await apiClient.get('/users/notifications', { signal });
    return res.data.data;
  },

  updateWishlistMetadata: async (universityId, metadata) => {
    const res = await apiClient.patch(`/api/wishlist/${universityId}`, metadata, { baseURL: '/' });
    return res.data;
  }
};
