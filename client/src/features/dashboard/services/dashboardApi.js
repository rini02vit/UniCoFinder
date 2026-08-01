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
    return new Promise(resolve => setTimeout(() => resolve({
      name: 'John Doe',
      cgpa: 3.8,
      degree: 'Bachelors',
      countryPreference: 'USA',
      course: 'Computer Science',
      budget: 50000
    }), 800));
  },
  
  getWishlist: async (signal) => {
    return new Promise(resolve => setTimeout(() => resolve([
      { _id: '1', universityId: { name: 'MIT', country: 'USA' } },
      { _id: '2', universityId: { name: 'Stanford University', country: 'USA' } },
      { _id: '3', universityId: { name: 'University of Toronto', country: 'Canada' } }
    ]), 1000));
  },
  
  getApplications: async (signal) => {
    return new Promise(resolve => setTimeout(() => resolve([
      { _id: '1', status: 'Pending', universityId: { name: 'MIT' }, updatedAt: new Date().toISOString() },
      { _id: '2', status: 'Accepted', universityId: { name: 'Stanford University' }, updatedAt: new Date(Date.now() - 86400000).toISOString() },
      { _id: '3', status: 'Rejected', universityId: { name: 'Harvard University' }, updatedAt: new Date(Date.now() - 172800000).toISOString() }
    ]), 1200));
  },
  
  getScholarships: async (signal) => {
    return new Promise(resolve => setTimeout(() => resolve([
      { _id: '1', title: 'Global Excellence Scholarship', description: 'Merit-based for international students', amount: 15000 },
      { _id: '2', title: 'STEM Women Fellowship', description: 'For women in engineering and tech', amount: 20000 }
    ]), 1500));
  },
  
  getRecommendedCountries: async (signal) => {
    return new Promise(resolve => setTimeout(() => resolve([
      { _id: '1', name: 'United States', description: 'Top universities, tech hubs, high cost of living' },
      { _id: '2', name: 'Canada', description: 'Immigration friendly, great quality of life' },
      { _id: '3', name: 'Germany', description: 'Low tuition fees, strong engineering programs' }
    ]), 1300));
  }
};
