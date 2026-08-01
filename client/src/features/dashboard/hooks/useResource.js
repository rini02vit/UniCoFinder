import { useState, useEffect, useCallback } from 'react';

/**
 * A generic hook to fetch data with AbortController support and unified state (Loading, Empty, Error, Success)
 */
export function useResource(fetchFn, mapperFn) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'empty'
  const [error, setError] = useState(null);

  const fetchResource = useCallback(async () => {
    const controller = new AbortController();
    
    setStatus('loading');
    setError(null);

    try {
      const rawData = await fetchFn(controller.signal);
      const mappedData = mapperFn ? mapperFn(rawData) : rawData;
      
      if (!mappedData || (Array.isArray(mappedData) && mappedData.length === 0)) {
        setStatus('empty');
      } else {
        setData(mappedData);
        setStatus('success');
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        // Request cancelled due to unmount, do nothing
        return;
      }
      console.error('Resource fetch error:', err);
      setError(err);
      setStatus('error');
    }

    return () => {
      controller.abort();
    };
  }, [fetchFn, mapperFn]);

  useEffect(() => {
    const cancel = fetchResource();
    return () => {
      if (cancel && typeof cancel.then === 'function') {
        cancel.then(abortFn => abortFn && abortFn());
      }
    };
  }, [fetchResource]);

  return { data, status, error, refetch: fetchResource };
}
