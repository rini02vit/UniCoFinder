// Cache structure:
// ratesCache.data = { [baseCurrency]: { target: rate, ... } }
// ratesCache.expiresAt = timestamp
const cache = new Map();
const TTL = 60 * 60 * 1000; // 1 hour

export const fetchLiveExchangeRates = async (baseCurrency = 'USD') => {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    const error = new Error('Currency API key is not configured.');
    error.statusCode = 500;
    throw error;
  }

  // Validate Cache
  const cachedData = cache.get(baseCurrency);
  if (cachedData && cachedData.expiresAt > Date.now()) {
    return cachedData.rates;
  }

  // Fetch from provider
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = new Error(`Currency provider HTTP error: ${response.status}`);
      error.statusCode = 502;
      throw error;
    }

    const data = await response.json();
    if (data && data.result === 'success' && data.conversion_rates) {
      // Cache the result
      cache.set(baseCurrency, {
        rates: data.conversion_rates,
        expiresAt: Date.now() + TTL
      });
      return data.conversion_rates;
    } else {
      const error = new Error('Provider returned malformed or unsuccessful response.');
      error.statusCode = 502;
      throw error;
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      const error = new Error('Currency provider timeout.');
      error.statusCode = 504;
      throw error;
    } else if (!err.statusCode) {
      const error = new Error('Currency provider request failed.');
      error.statusCode = 502;
      throw error;
    }
    throw err;
  }
};
