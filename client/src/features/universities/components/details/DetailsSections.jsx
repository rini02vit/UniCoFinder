import React from 'react';

export const UniversityHero = ({ title, location, image }) => {
  return (
    <div 
      className="uni-hero"
      style={{
        height: '250px',
        background: `linear-gradient(rgba(5, 8, 22, 0.5), rgba(5, 8, 22, 1)), url(${image}) center/cover`,
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '2rem',
        border: '1px solid var(--border-color)'
      }}
    >
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          {location}
        </p>
      </div>
    </div>
  );
};

export const StatisticsSection = ({ stats, config }) => {
  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Key Statistics</h3>
      <div className="card" style={{ padding: '0 1.5rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {config.map((item, idx) => {
            const rawValue = stats[item.key];
            const displayValue = item.format ? item.format(rawValue) : rawValue;
            
            return (
              <li 
                key={item.key}
                style={{
                  padding: '1rem 0',
                  borderBottom: idx === config.length - 1 ? 'none' : '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span className="text-secondary">{item.label}</span>
                <span style={{ fontWeight: 500 }}>{displayValue}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const AdmissionsSection = ({ predictor }) => {
  const { score, status, note } = predictor;
  
  return (
    <div 
      style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        marginBottom: '1.5rem'
      }}
    >
      <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Admission Predictor
      </h4>
      <div style={{
        fontSize: '3rem',
        fontWeight: 800,
        color: 'var(--success)',
        marginBottom: '0.5rem'
      }}>
        {score}%
      </div>
      <span 
        className={`badge ${status.includes('Safe') ? 'badge-green' : 'badge-orange'}`} 
        style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
      >
        {status}
      </span>
      <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
        {note}
      </p>
    </div>
  );
};

export const DetailsSkeleton = () => (
  <div style={{ opacity: 0.7 }}>
    <div className="skeleton-box" style={{ height: '250px', width: '100%', borderRadius: '16px', marginBottom: '2rem' }}></div>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <div className="skeleton-box" style={{ height: '30px', width: '30%', marginBottom: '1rem' }}></div>
        <div className="skeleton-box" style={{ height: '100px', width: '100%', marginBottom: '2rem' }}></div>
        <div className="skeleton-box" style={{ height: '30px', width: '30%', marginBottom: '1rem' }}></div>
        <div className="skeleton-box" style={{ height: '200px', width: '100%', borderRadius: '12px' }}></div>
      </div>
      <div>
        <div className="skeleton-box" style={{ height: '200px', width: '100%', borderRadius: '16px', marginBottom: '1.5rem' }}></div>
        <div className="skeleton-box" style={{ height: '150px', width: '100%', borderRadius: '12px' }}></div>
      </div>
    </div>
  </div>
);
