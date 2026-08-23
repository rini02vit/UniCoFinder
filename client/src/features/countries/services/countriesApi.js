import axios from 'axios';
import { generateCacheKey, getCache, setCache, PUBLIC_CACHE_TTL } from '../../../utils/apiCache';

// Create a configured axios instance for countries requests
const apiClient = axios.create({
  baseURL: '/api/countries',
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

// MOCK DATA for frontend UI development (since DB is disconnected)
const MOCK_COUNTRIES = [
  {
    _id: '1',
    name: 'United States',
    region: 'North America',
    images: { cover: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80' },
    overview: 'The United States boasts a massive international student population, world-class universities, and leading tech hubs.',
    costs: {
      avgTuition: 45000,
      livingCost: 25000,
      currency: 'USD'
    },
    visa: {
      type: 'F-1 Student Visa',
      proofOfFunds: 70000,
      processingTime: '2-4 Weeks'
    },
    employment: {
      partTimeHours: 20,
      postStudyVisa: '1-3 Years (OPT)',
      minWage: 7.25
    },
    // Top universities associated with this country
    topUniversities: [
      {
        _id: '1',
        name: 'Harvard University',
        location: { city: 'Cambridge', country: 'USA' },
        ranking: { qs: 1 },
        stats: { acceptanceRate: 4.0, tuitionFee: 54000 },
        images: { cover: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
        matchStatus: 'Target'
      }
    ]
  },
  {
    _id: '2',
    name: 'United Kingdom',
    region: 'Europe',
    images: { cover: 'https://images.unsplash.com/photo-1513635269975-59693e0cd156?w=1200&q=80' },
    overview: 'The UK offers deep academic history, diverse culture, and excellent one-year Master programs.',
    costs: {
      avgTuition: 30000,
      livingCost: 15000,
      currency: 'GBP'
    },
    visa: {
      type: 'Student Route (Tier 4)',
      proofOfFunds: 40000,
      processingTime: '3 Weeks'
    },
    employment: {
      partTimeHours: 20,
      postStudyVisa: '2 Years',
      minWage: 10.42
    },
    topUniversities: [
      {
        _id: '2',
        name: 'Oxford University',
        location: { city: 'Oxford', country: 'UK' },
        ranking: { qs: 2 },
        stats: { acceptanceRate: 17.0, tuitionFee: 38000 },
        images: { cover: 'https://images.unsplash.com/photo-1603366615917-1fa6dad5c4fa?w=800&q=80' },
        matchStatus: 'Reach'
      }
    ]
  }
];

export const countriesApi = {
  /**
   * Fetch all countries
   * @param {Object} params - { q, page, limit }
   * @param {AbortSignal} signal - For request cancellation
   */
  getCountries: async (params = {}, signal) => {
    const cacheKey = generateCacheKey('GET', '/api/countries', params);
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    // REAL IMPLEMENTATION:
    const response = await apiClient.get('/', { params, signal });
    
    const result = {
      data: response.data.data.countries || [],
      pagination: response.data.data.pagination || { total: 0, page: 1, pages: 1 }
    };

    setCache(cacheKey, result, PUBLIC_CACHE_TTL);
    return result;
  },

  /**
   * Fetch a single country by ID
   */
  getCountryById: async (id, signal) => {
    const cacheKey = generateCacheKey('GET', `/api/countries/${id}`);
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    // REAL IMPLEMENTATION:
    const response = await apiClient.get(`/${id}`, { signal });
    
    const result = {
      data: response.data.data.country
    };

    setCache(cacheKey, result, PUBLIC_CACHE_TTL);
    return result;
  }
};
