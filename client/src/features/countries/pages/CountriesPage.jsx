import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCountries } from '../hooks/useCountries';
import CountryCard from '../components/listing/CountryCard';
import { GridSkeleton } from '../../universities/components/listing/GridSkeleton'; // Reuse GridSkeleton
import Pagination from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';

const CountriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, pagination, status, error, retry } = useCountries();

  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const currentQuery = next.get('q') || '';
      
      if (debouncedSearch === currentQuery) return prev;
      
      if (debouncedSearch) next.set('q', debouncedSearch);
      else next.delete('q');
      
      next.set('page', 1);
      return next;
    }, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
  };

  const handlePageChange = (page) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', page);
      return next;
    });
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2>Explore Countries</h2>
        <p className="text-secondary">Find the perfect destination for your international studies.</p>
      </header>

      <fieldset style={{ border: 'none', padding: 0, marginBottom: '2rem' }}>
        <legend className="sr-only" style={{ display: 'none' }}>Country Search</legend>
        <input
          type="text"
          className="form-control"
          placeholder="Search countries by name..."
          value={localSearch}
          onChange={handleSearch}
          aria-label="Search countries"
          style={{ maxWidth: '400px', width: '100%' }}
        />
      </fieldset>

      <div aria-live="polite">
        {status === 'loading' && <GridSkeleton count={6} />}
        
        {status === 'error' && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon error" aria-hidden="true">⚠️</div>
            <h3 className="state-title">Failed to load countries</h3>
            <p className="state-desc">{error?.message || 'Please check your connection and try again.'}</p>
            <button className="btn btn-primary" onClick={retry} style={{ marginTop: '1rem' }}>
              Retry
            </button>
          </div>
        )}

        {status === 'empty' && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon" style={{ opacity: 0.5 }} aria-hidden="true">🌍</div>
            <h3 className="state-title">No countries available</h3>
            <p className="state-desc">Try adjusting your search criteria.</p>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                setLocalSearch('');
                setSearchParams({});
              }}
              style={{ marginTop: '1rem' }}
            >
              Clear Search
            </button>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {data.map(country => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
            {pagination && (
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CountriesPage;
