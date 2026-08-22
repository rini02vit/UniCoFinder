import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { countriesApi } from '../services/countriesApi';
import { mapCountryListItem } from '../utils/countryMappers';

export const useCountries = () => {
  const [searchParams] = useSearchParams();
  
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'empty', 'error'
  const [error, setError] = useState(null);
  
  // Track refresh token to allow retry without unmounting hook
  const [refreshKey, setRefreshKey] = useState(0);
  
  const retry = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchCountries = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        const params = {
          q: searchParams.get('q') || '',
          page: searchParams.get('page') || 1,
          limit: 12
        };

        const response = await countriesApi.getCountries(params, controller.signal);
        
        const mappedData = response.data.map(mapCountryListItem);
        
        setData(mappedData);
        setPagination(response.pagination || { page: 1, pages: 1, total: mappedData.length });
        setStatus(mappedData.length > 0 ? 'success' : 'empty');
        
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch countries:', err);
        setError(err);
        setStatus('error');
      }
    };

    fetchCountries();

    return () => controller.abort();
  }, [searchParams, refreshKey]);

  return {
    data,
    pagination,
    status,
    error,
    retry
  };
};
