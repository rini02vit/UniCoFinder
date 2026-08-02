import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCompareData } from '../hooks/useCompareData';
import { MAX_COMPARE_LIMIT } from '../constants/compareConfig';
import ComparisonHeader from '../components/ComparisonHeader';
import CompareTable from '../components/CompareTable';
import { ComparisonSkeleton } from '../components/ComparisonSkeleton';
import AddUniversityModal from '../components/AddUniversityModal';

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse ids from URL and ensure it's a valid unique set
  const currentIdsList = useMemo(() => {
    const idsParam = searchParams.get('ids');
    if (!idsParam) return [];
    return Array.from(new Set(idsParam.split(',').filter(Boolean)));
  }, [searchParams]);

  const currentIdsSet = useMemo(() => new Set(currentIdsList), [currentIdsList]);

  // Fetch data
  const { data, status, error, retry } = useCompareData(currentIdsList);

  // URL State Mutators
  const handleAdd = useCallback((id) => {
    if (currentIdsSet.size >= MAX_COMPARE_LIMIT) return;
    
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const newIds = [...currentIdsList, id];
      next.set('ids', newIds.join(','));
      next.delete('q'); // Clear search query from URL atomically
      return next;
    });
  }, [currentIdsList, currentIdsSet, setSearchParams]);

  const handleRemove = useCallback((id) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const newIds = currentIdsList.filter(existingId => existingId !== id);
      
      if (newIds.length > 0) {
        next.set('ids', newIds.join(','));
      } else {
        next.delete('ids');
      }
      return next;
    });
  }, [currentIdsList, setSearchParams]);

  return (
    <div>
      <ComparisonHeader 
        currentCount={currentIdsSet.size} 
        onAddClick={() => setIsModalOpen(true)} 
      />

      <div aria-live="polite">
        {status === 'loading' && <ComparisonSkeleton />}
        
        {status === 'empty' && (
          <div className="state-container card" style={{ padding: '4rem 2rem' }}>
            <div className="state-icon" style={{ opacity: 0.5 }} aria-hidden="true">⚖️</div>
            <h3 className="state-title">Compare Universities</h3>
            <p className="state-desc" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Add up to {MAX_COMPARE_LIMIT} universities to see a side-by-side comparison of tuition, rankings, and more.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              + Add First University
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon error" aria-hidden="true">⚠️</div>
            <h3 className="state-title">Failed to load comparison</h3>
            <p className="state-desc">{error?.message || 'Please check your connection and try again.'}</p>
            <button className="btn btn-primary" onClick={retry} style={{ marginTop: '1rem' }}>
              Retry
            </button>
          </div>
        )}

        {status === 'success' && (
          <CompareTable universities={data} onRemove={handleRemove} />
        )}
      </div>

      <AddUniversityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentIds={currentIdsSet}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default ComparePage;
