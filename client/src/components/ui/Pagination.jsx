import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, btnClass = "btn btn-outline" }) => {
  const page = Number(currentPage) || 1;
  const pages = Number(totalPages) || 1;

  // Render nothing if there is 0 or 1 page
  if (pages <= 1) {
    return null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
      <button 
        className={btnClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
        Page {page} of {pages}
      </span>
      <button 
        className={btnClass}
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
