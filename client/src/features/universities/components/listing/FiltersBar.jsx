import React, { useState, useEffect } from 'react';
import { COUNTRY_OPTIONS, BUDGET_OPTIONS, SORT_OPTIONS } from '../../constants/universitiesConfig';

const FiltersBar = ({ currentParams, onUpdateParams }) => {
  const [localSearch, setLocalSearch] = useState(currentParams.get('q') || '');
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onUpdateParams('q', localSearch);
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, onUpdateParams]);

  const handleSelectChange = (key, value) => {
    onUpdateParams(key, value);
  };

  const handleClear = () => {
    setLocalSearch('');
    // Calling with null/empty values clears them in the parent
    onUpdateParams('clear_all', true); 
  };

  return (
    <fieldset className="filters-bar" style={{ 
      display: 'flex', 
      gap: '1rem', 
      marginBottom: '2rem', 
      flexWrap: 'wrap',
      border: 'none',
      padding: 0
    }}>
      <legend className="sr-only" style={{ display: 'none' }}>University Filters</legend>
      
      <div style={{ flex: '1 1 250px', position: 'relative' }}>
        <input
          type="text"
          className="form-control"
          style={{ width: '100%' }}
          placeholder="Search universities..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          aria-label="Search universities"
        />
        {localSearch && (
          <button 
            onClick={() => setLocalSearch('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <select 
        className="form-control" 
        style={{ flex: '1 1 150px' }}
        value={currentParams.get('country') || ''}
        onChange={(e) => handleSelectChange('country', e.target.value)}
        aria-label="Filter by country"
      >
        {COUNTRY_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select 
        className="form-control" 
        style={{ flex: '1 1 150px' }}
        value={currentParams.get('budget') || ''}
        onChange={(e) => handleSelectChange('budget', e.target.value)}
        aria-label="Filter by budget"
      >
        {BUDGET_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select 
        className="form-control" 
        style={{ flex: '1 1 150px' }}
        value={currentParams.get('sort') || ''}
        onChange={(e) => handleSelectChange('sort', e.target.value)}
        aria-label="Sort universities"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {(currentParams.toString() !== '') && (
        <button 
          className="btn btn-outline" 
          onClick={handleClear}
          style={{ padding: '0 1rem' }}
        >
          Clear Filters
        </button>
      )}
    </fieldset>
  );
};

export default FiltersBar;
