import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCacheKey, getCache, setCache, invalidateCache, clearCache } from '../apiCache';

describe('apiCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearCache();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('generateCacheKey', () => {
    it('generates a key without params', () => {
      const key = generateCacheKey('GET', '/api/universities');
      expect(key).toBe('GET:/api/universities');
    });

    it('generates a deterministic key regardless of param order', () => {
      const key1 = generateCacheKey('GET', '/api/universities', { page: 1, q: 'harvard' });
      const key2 = generateCacheKey('GET', '/api/universities', { q: 'harvard', page: 1 });
      expect(key1).toBe(key2);
      expect(key1).toBe('GET:/api/universities?page=1&q=harvard');
    });

    it('ignores undefined and null values', () => {
      const key = generateCacheKey('GET', '/api/universities', { page: 1, limit: undefined, search: null });
      expect(key).toBe('GET:/api/universities?page=1');
    });
  });

  describe('getCache and setCache', () => {
    it('returns undefined for missing keys', () => {
      expect(getCache('GET:/api/test')).toBeUndefined();
    });

    it('sets and gets a value successfully', () => {
      const key = 'GET:/api/test';
      setCache(key, { data: 'test' }, 5000);
      expect(getCache(key)).toEqual({ data: 'test' });
    });

    it('returns undefined if the entry has expired', () => {
      const key = 'GET:/api/test';
      setCache(key, { data: 'test' }, 5000);
      
      // Fast forward 6 seconds
      vi.advanceTimersByTime(6000);
      
      expect(getCache(key)).toBeUndefined();
    });

    it('does not cache if TTL is <= 0', () => {
      const key = 'GET:/api/test';
      setCache(key, { data: 'test' }, 0);
      expect(getCache(key)).toBeUndefined();
    });
  });

  describe('invalidateCache', () => {
    it('invalidates entries that include the prefix', () => {
      setCache('GET:/api/universities?page=1', { data: 1 }, 5000);
      setCache('GET:/api/universities/123', { data: 2 }, 5000);
      setCache('GET:/api/countries?page=1', { data: 3 }, 5000);

      invalidateCache('/api/universities');

      expect(getCache('GET:/api/universities?page=1')).toBeUndefined();
      expect(getCache('GET:/api/universities/123')).toBeUndefined();
      expect(getCache('GET:/api/countries?page=1')).toEqual({ data: 3 });
    });
  });

  describe('clearCache', () => {
    it('clears all entries', () => {
      setCache('k1', 'v1', 5000);
      setCache('k2', 'v2', 5000);
      
      clearCache();
      
      expect(getCache('k1')).toBeUndefined();
      expect(getCache('k2')).toBeUndefined();
    });
  });
});
