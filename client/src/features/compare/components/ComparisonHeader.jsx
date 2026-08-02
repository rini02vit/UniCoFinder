import React from 'react';
import { MAX_COMPARE_LIMIT } from '../constants/compareConfig';

const ComparisonHeader = ({ currentCount, onAddClick }) => {
  const isAtLimit = currentCount >= MAX_COMPARE_LIMIT;

  return (
    <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h2>University Comparison</h2>
        <p className="text-secondary">
          Side-by-side comparison of your shortlisted universities ({currentCount}/{MAX_COMPARE_LIMIT}).
        </p>
      </div>
      
      <button 
        className="btn btn-outline" 
        onClick={onAddClick}
        disabled={isAtLimit}
        aria-disabled={isAtLimit}
        title={isAtLimit ? `Maximum of ${MAX_COMPARE_LIMIT} universities allowed` : 'Add another university to compare'}
      >
        + Add University
      </button>
    </header>
  );
};

export default ComparisonHeader;
