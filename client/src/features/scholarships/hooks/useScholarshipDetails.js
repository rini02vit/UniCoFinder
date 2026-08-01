import { useState, useEffect, useCallback } from 'react';
import { scholarshipsApi } from '../services/scholarshipsApi';
import { mapScholarshipDetails } from '../utils/scholarshipMappers';

export const useScholarshipDetails = (id) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const retry = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();
    
    const fetchDetails = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        const response = await scholarshipsApi.getScholarshipById(id, controller.signal);
        const mappedData = mapScholarshipDetails(response.data);
        
        setData(mappedData);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch scholarship details:', err);
        setError(err);
        setStatus('error');
      }
    };

    fetchDetails();

    return () => controller.abort();
  }, [id, refreshKey]);

  return { data, status, error, retry };
};
