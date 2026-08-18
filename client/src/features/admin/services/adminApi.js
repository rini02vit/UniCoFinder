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
  },

  // Countries
  getCountries: async (params = {}) => {
    const response = await apiClient.get('/countries', { params });
    return response.data;
  },
  getCountryById: async (id) => {
    const response = await apiClient.get(`/countries/${id}`);
    return response.data;
  },
  createCountry: async (data) => {
    const response = await apiClient.post('/countries', data);
    return response.data;
  },
  updateCountry: async (id, data) => {
    const response = await apiClient.put(`/countries/${id}`, data);
    return response.data;
  },
  deleteCountry: async (id) => {
    const response = await apiClient.delete(`/countries/${id}`);
    return response.data;
  },

  // Universities
  getUniversities: async (params = {}) => {
    const response = await apiClient.get('/universities', { params });
    return response.data;
  },
  getUniversityById: async (id) => {
    const response = await apiClient.get(`/universities/${id}`);
    return response.data;
  },
  createUniversity: async (data) => {
    const response = await apiClient.post('/universities', data);
    return response.data;
  },
  updateUniversity: async (id, data) => {
    const response = await apiClient.put(`/universities/${id}`, data);
    return response.data;
  },
  deleteUniversity: async (id) => {
    const response = await apiClient.delete(`/universities/${id}`);
    return response.data;
  },

  // Scholarships
  getScholarships: async (params = {}) => {
    const response = await apiClient.get('/scholarships', { params });
    return response.data;
  },
  getScholarshipById: async (id) => {
    const response = await apiClient.get(`/scholarships/${id}`);
    return response.data;
  },
  createScholarship: async (data) => {
    const response = await apiClient.post('/scholarships', data);
    return response.data;
  },
  updateScholarship: async (id, data) => {
    const response = await apiClient.put(`/scholarships/${id}`, data);
    return response.data;
  },
  deleteScholarship: async (id) => {
    const response = await apiClient.delete(`/scholarships/${id}`);
    return response.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  updateUserStatus: async (id, isActive) => {
    const response = await apiClient.patch(`/users/${id}/status`, { isActive });
    return response.data;
  }
};

