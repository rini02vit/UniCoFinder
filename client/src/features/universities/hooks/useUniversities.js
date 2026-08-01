import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { universitiesApi } from '../services/universitiesApi';
import { mapUniversityListItem } from '../utils/universityMappers';

export const useUniversities = () => {
  const [searchParams] = useSearchParams();
  
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'empty', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchUniversities = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        const params = {
          q: searchParams.get('q') || '',
          country: searchParams.get('country') || '',
          budget: searchParams.get('budget') || '',
          sort: searchParams.get('sort') || '',
          page: searchParams.get('page') || 1,
          limit: 12
        };

        const response = await universitiesApi.getUniversities(params, controller.signal);
        
        const mappedData = response.data.map(mapUniversityListItem);
        
        setData(mappedData);
        setPagination(response.pagination);
        setStatus(mappedData.length > 0 ? 'success' : 'empty');
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted due to rapid search updates');
          return;
        }
        console.error('Failed to fetch universities:', err);
        setError(err);
        setStatus('error');
      }
    };

    fetchUniversities();

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  return {
    data,
    pagination,
    status,
    error
  };
};
