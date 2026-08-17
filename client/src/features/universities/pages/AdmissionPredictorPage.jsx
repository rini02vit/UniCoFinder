import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePredictor } from '../hooks/usePredictor';
import { useWishlistMutation } from '../hooks/useWishlistMutation';
import FiltersBar from '../components/listing/FiltersBar';
import UniversityCard from '../components/listing/UniversityCard';
import { GridSkeleton } from '../components/listing/GridSkeleton';

const AdmissionPredictorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, status, error, pagination } = usePredictor();

  const handleUpdateParams = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (key === 'clear_all') {
        return new URLSearchParams(); // Reset everything
      }
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', 1); // Reset to page 1 on any filter change
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const { toggleWishlist } = useWishlistMutation(false);

  const handleSave = useCallback((id) => {
    toggleWishlist(id);
  }, [toggleWishlist]);

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2>Admission Predictor</h2>
        <p className="text-secondary">
          Analyze your profile against university requirements to find your best matches.
        </p>
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(255, 165, 0, 0.1)', 
          borderLeft: '4px solid orange',
          borderRadius: '4px'
        }}>
          <strong>Disclaimer:</strong> Safe, Target, and Dream are heuristic classifications based on your profile and available university data. They are not guarantees of admission.
        </div>
      </header>

      {/* Reusing FiltersBar for country and budget filtering */}
      <FiltersBar 
        currentParams={searchParams} 
        onUpdateParams={handleUpdateParams} 
      />

      <div aria-live="polite">
        {status === 'loading' && <GridSkeleton count={8} />}
        
        {status === 'error' && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon error">⚠️</div>
            <h3 className="state-title">Failed to load predictions</h3>
            <p className="state-desc">{error?.message || 'Please check your connection and try again.'}</p>
          </div>
        )}

        {status === 'empty' && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon" style={{ opacity: 0.5 }}>🔍</div>
            <h3 className="state-title">No predictions found</h3>
            <p className="state-desc">Try adjusting your filters or searching for something else.</p>
            <button 
              className="btn btn-outline" 
              onClick={() => handleUpdateParams('clear_all', true)}
              style={{ marginTop: '1rem' }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {data.map(uni => (
                <UniversityCard 
                  key={uni.id} 
                  university={uni} 
                  onSave={handleSave} 
                />
              ))}
            </div>

            {pagination?.pages > 1 && (
              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button 
                  className="btn btn-outline"
                  disabled={pagination.page <= 1}
                  onClick={() => handleUpdateParams('page', Number(pagination.page) - 1)}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button 
                  className="btn btn-outline"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => handleUpdateParams('page', Number(pagination.page) + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdmissionPredictorPage;
