import axios from 'axios';

// Create a configured axios instance for universities requests
const apiClient = axios.create({
  baseURL: '/api/universities',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach token to requests (needed for wishlist/apply)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// MOCK DATA for frontend UI development (since DB is disconnected)
const MOCK_UNIVERSITIES = [
  {
    _id: '1',
    name: 'Harvard University',
    location: { city: 'Cambridge', country: 'USA' },
    ranking: { qs: 1 },
    stats: { acceptanceRate: 4.0, tuitionFee: 54000, minCgpa: 3.8 },
    images: { cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
    matchStatus: 'Safe Match'
  },
  {
    _id: '2',
    name: 'Oxford University',
    location: { city: 'Oxford', country: 'UK' },
    ranking: { qs: 2 },
    stats: { acceptanceRate: 17.0, tuitionFee: 38000, minCgpa: 3.7 },
    images: { cover: 'https://images.unsplash.com/photo-1603366615917-1fa6dad5c4fa?w=800&q=80' },
    matchStatus: 'Target'
  },
  {
    _id: '3',
    name: 'University of Toronto',
    location: { city: 'Toronto', country: 'Canada' },
    ranking: { qs: 21 },
    stats: { acceptanceRate: 43.0, tuitionFee: 42000, minCgpa: 3.0 },
    images: { cover: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800&q=80' },
    matchStatus: 'Safe Match'
  },
  {
    _id: '4',
    name: 'University of Melbourne',
    location: { city: 'Melbourne', country: 'Australia' },
    ranking: { qs: 14 },
    stats: { acceptanceRate: 35.0, tuitionFee: 45000, minCgpa: 3.2 },
    images: { cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80' },
    matchStatus: 'Reach'
  }
];

export const universitiesApi = {
  /**
   * Fetch all universities based on search and filters
   * @param {Object} params - { q, country, budget, sort, page, limit }
   * @param {AbortSignal} signal - For request cancellation
   */
  getUniversities: async (params, signal) => {
    // REAL IMPLEMENTATION:
    // const response = await apiClient.get('/', { params, signal });
    // return response.data;
    
    // MOCK IMPLEMENTATION:
    return new Promise((resolve, reject) => {
      // Simulate network delay
      const timeout = setTimeout(() => {
        let results = [...MOCK_UNIVERSITIES];
        
        if (params.q) {
          const query = params.q.toLowerCase();
          results = results.filter(u => u.name.toLowerCase().includes(query));
        }
        if (params.country) {
          results = results.filter(u => u.location.country === params.country);
        }
        
        // Simulating pagination wrapper
        resolve({
          data: results,
          pagination: {
            total: results.length,
            page: params.page || 1,
            pages: Math.ceil(results.length / (params.limit || 10))
          }
        });
      }, 600);

      // Support abortion
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  },

  /**
   * Fetch a single university by ID
   */
  getUniversityById: async (id, signal) => {
    // REAL IMPLEMENTATION:
    // const response = await apiClient.get(`/${id}`, { signal });
    // return response.data;

    // MOCK IMPLEMENTATION:
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const uni = MOCK_UNIVERSITIES.find(u => u._id === id);
        if (uni) resolve({ data: uni });
        else reject(new Error('University not found'));
      }, 600);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  },

  /**
   * Toggle a university in the user's wishlist
   */
  toggleWishlist: async (universityId) => {
    // REAL IMPLEMENTATION:
    // const response = await apiClient.post(`/${universityId}/wishlist`);
    // return response.data;

    // MOCK IMPLEMENTATION:
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 400));
  },

  /**
   * Apply to a university
   */
  applyToUniversity: async (universityId) => {
    // REAL IMPLEMENTATION:
    // const response = await apiClient.post(`/${universityId}/apply`);
    // return response.data;

    // MOCK IMPLEMENTATION:
    return new Promise((resolve, reject) => setTimeout(() => resolve({ success: true }), 800));
  },

  /**
   * Fetch admission predictions for the current user
   */
  getPredictions: async (params, signal) => {
    // Using explicit URL for local dev without proxy, will work perfectly in prod
    const response = await apiClient.get('http://localhost:5005/api/universities/predict', { params, signal });
    return response.data;
  }
};
