import { useState, useCallback, useEffect } from 'react';
import { trackerApi } from '../services/trackerApi';
import { normalizeApplicationData } from '../utils/trackerMappers';

export const useTracker = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (abortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const rawData = await trackerApi.getApplications(abortSignal);
      const normalized = normalizeApplicationData(rawData);
      setApplications(normalized);
    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'canceled') {
        return; // Ignore aborts
      }
      setError(err.message || 'Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchApplications(controller.signal);
    
    return () => {
      controller.abort();
    };
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    error,
    retry: fetchApplications
  };
};
