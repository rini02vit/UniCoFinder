import axios from 'axios';

// Create a configured axios instance for auth requests
const apiClient = axios.create({
  baseURL: '/api/auth', // Assuming proxy is set up in vite.config.js for /api
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

export const authApi = {
  /**
   * Authenticate a user
   * @param {Object} credentials { email, password }
   * @returns {Promise<Object>} { token, user }
   */
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData { name, email, password }
   * @returns {Promise<Object>} { token, user }
   */
  register: async (userData) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },

  /**
   * Get the current authenticated user
   * @returns {Promise<Object>} user
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  /**
   * Request a password reset email (UI Flow Only / Mocked)
   * @param {string} email
   * @returns {Promise<boolean>} success
   */
  requestPasswordReset: async (email) => {
    // Mocking an async request for the UI flow
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  }
};
