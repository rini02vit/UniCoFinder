import { useState, useEffect, useCallback } from 'react';
import { universitiesApi } from '../../universities/services/universitiesApi';

export const useCompareData = (ids = []) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('empty'); // 'loading', 'success', 'empty', 'error'
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const retry = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setData([]);
      setStatus('empty');
      return;
    }

    const controller = new AbortController();
    
    const fetchComparisonData = async () => {
      setStatus('loading');
      setError(null);
      
      try {
        // Execute parallel requests for all selected IDs
        const promises = ids.map(id => universitiesApi.getUniversityById(id, controller.signal));
        const results = await Promise.allSettled(promises);
        
        // Filter out fulfilled promises and extract data
        const successfulData = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value.data);
          
        if (successfulData.length === 0) {
          throw new Error('Could not fetch any of the selected universities.');
        }

        setData(successfulData);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch comparison data:', err);
        setError(err);
        setStatus('error');
      }
    };

    fetchComparisonData();

    return () => controller.abort();
  }, [ids.join(','), refreshKey]); // use ids.join to avoid infinite re-renders if a new array instance is passed

  return { data, status, error, retry };
};
