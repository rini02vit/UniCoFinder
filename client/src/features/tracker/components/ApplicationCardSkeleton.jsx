import React from 'react';

const ApplicationCardSkeleton = () => {
  return (
    <div className="card skeleton-bg" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', height: '140px' }} aria-hidden="true">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '40%', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
        <div style={{ width: '80px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: 'auto' }}></div>
    </div>
  );
};

export default React.memo(ApplicationCardSkeleton);
