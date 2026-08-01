import { useState, useEffect } from 'react';
import { universitiesApi } from '../services/universitiesApi';
import { mapUniversityDetails } from '../utils/universityMappers';

export const useUniversityDetails = (id) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const controller = new AbortController();
    
    const fetchDetails = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        const response = await universitiesApi.getUniversityById(id, controller.signal);
        const mappedData = mapUniversityDetails(response.data);
        
        setData(mappedData);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch university details:', err);
        setError(err);
        setStatus('error');
      }
    };

    fetchDetails();

    return () => controller.abort();
  }, [id]);

  return { data, status, error };
};
