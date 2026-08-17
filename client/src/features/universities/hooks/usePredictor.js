import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { universitiesApi } from '../services/universitiesApi';
import { mapUniversityListItem } from '../utils/universityMappers';

export const usePredictor = () => {
  const [searchParams] = useSearchParams();
  
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'empty', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPredictions = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        const params = {
          country: searchParams.get('country') || '',
          maxTuition: searchParams.get('maxTuition') || '',
          page: searchParams.get('page') || 1,
          limit: 12
        };

        const response = await universitiesApi.getPredictions(params, controller.signal);
        
        // Use existing mapper, but map prediction details
        const mappedData = response.data.universities.map(uni => {
          const mapped = mapUniversityListItem(uni);
          // Append prediction-specific data
          mapped.matchStatus = uni.matchStatus; // Overrides mock matchStatus with real prediction
          mapped.explanation = uni.explanation;
          mapped.scoreBreakdown = uni.scoreBreakdown;
          return mapped;
        });
        
        setData(mappedData);
        setPagination(response.data.pagination);
        setStatus(mappedData.length > 0 ? 'success' : 'empty');
        
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch predictions:', err);
        setError(err.response?.data?.errors?.[0] || err);
        setStatus('error');
      }
    };

    fetchPredictions();

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
