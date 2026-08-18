import React from 'react';
import { useRecentlyViewed } from '../../../universities/hooks/useRecentlyViewed';

const RecentlyViewedWidget = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <h3>👀 Recently Viewed</h3>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {recentlyViewed.map((uni, idx) => (
            <div key={uni._id || idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {uni.name}
              </div>
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{uni.city}, {uni.country}</div>
              <a href={`/universities/${uni._id}`} className="btn btn-outline" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', padding: '0.3rem', fontSize: '0.9rem' }}>
                View Again
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedWidget;
