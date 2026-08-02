import React from 'react';

const TrackerProgress = ({ value = 0, label = 'Progress', color = 'var(--primary-cyan)', showPercentage = true }) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        {showPercentage && <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{safeValue}%</span>}
      </div>
      <div 
        role="progressbar" 
        aria-valuenow={safeValue} 
        aria-valuemin="0" 
        aria-valuemax="100"
        style={{
          height: '8px',
          background: 'var(--border-color)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            height: '100%',
            width: `${safeValue}%`,
            background: color,
            transition: 'width 0.5s ease-out'
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(TrackerProgress);
