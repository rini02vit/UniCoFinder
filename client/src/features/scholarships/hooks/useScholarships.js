import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scholarshipsApi } from '../services/scholarshipsApi';
import { mapScholarshipListItem } from '../utils/scholarshipMappers';

export const useScholarships = () => {
  const [searchParams] = useSearchParams();
  
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'empty', 'error'
  const [error, setError] = useState(null);
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  const retry = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchScholarships = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        const params = {
          q: searchParams.get('q') || '',
          page: searchParams.get('page') || 1,
          limit: 12
        };

        const response = await scholarshipsApi.getScholarships(params, controller.signal);
        const mappedData = response.data.map(mapScholarshipListItem);
        
        setData(mappedData);
        setStatus(mappedData.length > 0 ? 'success' : 'empty');
        
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch scholarships:', err);
        setError(err);
        setStatus('error');
      }
    };

    fetchScholarships();

    return () => controller.abort();
  }, [searchParams, refreshKey]);

  return { data, status, error, retry };
};
