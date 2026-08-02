import { MOCK_EXCHANGE_RATES } from '../constants/currencyConfig';

/**
 * Service to fetch exchange rates.
 * If VITE_EXCHANGE_RATE_API_KEY is provided, it attempts a live fetch (e.g. ExchangeRate-API).
 * Otherwise, or on failure, it silently falls back to static mock rates.
 */
export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

  if (apiKey) {
    try {
      // ExchangeRate-API endpoint
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.result === 'success' && data.conversion_rates) {
        return data.conversion_rates;
      }
    } catch (error) {
      console.warn('Failed to fetch live exchange rates. Falling back to static data.', error);
      // Fall through to mock logic below
    }
  }

  // Fallback: Calculate rates relative to the requested baseCurrency using our USD mock dict
  const baseRateInUSD = MOCK_EXCHANGE_RATES[baseCurrency] || 1;
  const convertedRates = {};
  
  for (const [currency, usdRate] of Object.entries(MOCK_EXCHANGE_RATES)) {
    // If base is EUR (0.92), and target is GBP (0.78)
    // 1 EUR in USD = (1 / 0.92). Then in GBP = (1 / 0.92) * 0.78
    convertedRates[currency] = usdRate / baseRateInUSD;
  }

  return convertedRates;
};
