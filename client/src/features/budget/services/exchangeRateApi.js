import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
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
}, (error) => Promise.reject(error));

/**
 * Service to fetch exchange rates.
 * Calls the internal backend proxy at /api/currency/rates to securely fetch rates.
 */
export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await apiClient.get(`/currency/rates?base=${baseCurrency}`);
    
    if (response.data.success && response.data.data.rates) {
      return response.data.data.rates;
    } else {
      throw new Error(response.data.message || 'Failed to fetch exchange rates');
    }
  } catch (error) {
    console.error('Failed to fetch live exchange rates from backend.', error);
    // Explicitly throw the error so the caller handles it (no silent mock fallbacks)
    throw error;
  }
};
