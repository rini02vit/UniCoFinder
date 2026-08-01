import React from 'react';

const MetricsGrid = ({ title, data, config }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem' 
        }}
      >
        {config.map((item) => {
          const rawValue = data[item.key];
          
          return (
            <div 
              key={item.key}
              className="card" 
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '1.2rem' }} aria-hidden="true">{item.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {rawValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsGrid;
