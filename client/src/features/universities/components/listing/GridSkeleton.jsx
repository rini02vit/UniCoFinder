import React from 'react';

export const UniversityCardSkeleton = () => (
  <div className="card" style={{ opacity: 0.7 }}>
    <div className="skeleton-box" style={{ height: '160px', width: '100%', borderRadius: '12px', marginBottom: '1rem' }}></div>
    <div className="skeleton-box" style={{ height: '24px', width: '70%', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-box" style={{ height: '16px', width: '50%', marginBottom: '1rem' }}></div>
    
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <div className="skeleton-box" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div>
      <div className="skeleton-box" style={{ height: '24px', width: '80px', borderRadius: '12px' }}></div>
    </div>
    
    <div className="skeleton-box" style={{ height: '16px', width: '60%', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-box" style={{ height: '16px', width: '40%', marginBottom: '1rem' }}></div>
    
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      <div className="skeleton-box" style={{ height: '38px', width: '80px', borderRadius: '8px' }}></div>
      <div className="skeleton-box" style={{ height: '38px', flex: 1, borderRadius: '8px' }}></div>
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
    {Array.from({ length: count }).map((_, i) => (
      <UniversityCardSkeleton key={i} />
    ))}
  </div>
);
