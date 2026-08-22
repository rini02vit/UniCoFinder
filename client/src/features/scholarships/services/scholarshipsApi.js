import axios from 'axios';
import { generateCacheKey, getCache, setCache, PUBLIC_CACHE_TTL } from '../../../utils/apiCache';

const apiClient = axios.create({
  baseURL: '/api/scholarships',
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

// MOCK DATA
const MOCK_SCHOLARSHIPS = [
  {
    _id: '1',
    title: 'Fulbright Foreign Student Program',
    provider: 'U.S. Department of State',
    country: 'USA',
    fundingType: 'Fully Funded',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    description: 'This program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.',
    benefits: 'Covers full tuition, airfare, living stipend, and health insurance.',
    officialWebsite: 'https://foreign.fulbrightonline.org/',
    eligibility: {
      degreeLevel: ['Masters', 'PhD'],
      targetRegion: 'International',
      minGpa: 3.5,
      languageReq: 'IELTS/TOEFL required'
    }
  },
  {
    _id: '2',
    title: 'Chevening Scholarship',
    provider: 'UK Government',
    country: 'UK',
    fundingType: 'Full Tuition + Stipend',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: 'Chevening is the UK government’s international awards program aimed at developing global leaders.',
    benefits: 'University tuition fees, a monthly living stipend, an economy class return flight to the UK.',
    officialWebsite: 'https://www.chevening.org/',
    eligibility: {
      degreeLevel: ['Masters'],
      targetRegion: 'International',
      minGpa: null,
      languageReq: 'No specific test required for application, but university conditions apply'
    }
  },
  {
    _id: '3',
    title: 'Eiffel Excellence Scholarship',
    provider: 'French Ministry for Europe and Foreign Affairs',
    country: 'France',
    fundingType: 'Monthly Stipend',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    description: 'Developed by the Ministry for Europe and Foreign Affairs to allow French higher education institutions to attract top foreign students.',
    benefits: 'Monthly allowance of €1,181, one international return journey, social security cover.',
    officialWebsite: 'invalid-url', // Testing graceful degradation
    eligibility: {
      degreeLevel: ['Masters', 'PhD'],
      targetRegion: 'International (Developing countries for Masters, all for PhD)',
      minGpa: 3.0,
      languageReq: 'French or English depending on program'
    }
  }
];

export const scholarshipsApi = {
  getScholarships: async (params = {}, signal) => {
    const cacheKey = generateCacheKey('GET', '/api/scholarships', params);
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    // REAL IMPLEMENTATION:
    // const response = await apiClient.get('/', { params, signal });
    // setCache(cacheKey, response.data, PUBLIC_CACHE_TTL);
    // return response.data;
    
    const response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        let results = [...MOCK_SCHOLARSHIPS];
        
        if (params.q) {
          const query = params.q.toLowerCase();
          results = results.filter(s => 
            s.title.toLowerCase().includes(query) || 
            s.provider.toLowerCase().includes(query)
          );
        }

        resolve({
          data: results,
          pagination: { total: results.length, page: 1, pages: 1 }
        });
      }, 500);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });

    setCache(cacheKey, response, PUBLIC_CACHE_TTL);
    return response;
  },

  getScholarshipById: async (id, signal) => {
    const cacheKey = generateCacheKey('GET', `/api/scholarships/${id}`);
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    // REAL IMPLEMENTATION:
    // const response = await apiClient.get(`/${id}`, { signal });
    // setCache(cacheKey, response.data, PUBLIC_CACHE_TTL);
    // return response.data;

    const response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const scholarship = MOCK_SCHOLARSHIPS.find(s => s._id === id);
        if (scholarship) resolve({ data: scholarship });
        else reject(new Error('Scholarship not found'));
      }, 500);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });

    setCache(cacheKey, response, PUBLIC_CACHE_TTL);
    return response;
  }
};
