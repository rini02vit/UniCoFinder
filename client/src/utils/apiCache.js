const cache = new Map();

/**
 * Generate a deterministic cache key from the HTTP method, path, and query parameters.
 * @param {string} method - HTTP method (e.g., 'GET')
 * @param {string} path - The endpoint path (e.g., '/api/universities')
 * @param {Object} [params={}] - The query parameters object
 * @returns {string} The deterministic cache key
 */
export const generateCacheKey = (method, path, params = {}) => {
  const methodUpper = method.toUpperCase();
  
  // Filter out undefined and null values, and sort keys to guarantee deterministic order
  const sortedParams = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
    
  return `${methodUpper}:${path}${sortedParams ? '?' + sortedParams : ''}`;
};

/**
 * Retrieve a value from the cache.
 * If the value has expired, it is removed and undefined is returned.
 * @param {string} key - The cache key
 * @returns {any|undefined} The cached value, or undefined if missed/expired
 */
export const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return undefined;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return undefined;
  }

  return entry.value;
};

/**
 * Store a value in the cache with a specified Time-To-Live (TTL).
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} ttlMs - Time to live in milliseconds
 */
export const setCache = (key, value, ttlMs) => {
  if (ttlMs <= 0) return; // Do not cache if TTL is 0 or negative
  
  cache.set(key, {
    value,
    expiry: Date.now() + ttlMs
  });
};

/**
 * Invalidate all cache entries whose keys start with the given prefix.
 * Useful for family-level invalidation (e.g., '/api/universities').
 * @param {string} prefix - The string prefix to invalidate
 */
export const invalidateCache = (prefix) => {
  for (const key of cache.keys()) {
    if (key.includes(prefix)) {
      cache.delete(key);
    }
  }
};

/**
 * Clear the entire cache.
 */
export const clearCache = () => {
  cache.clear();
};

export const PUBLIC_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
