import React from 'react';

const DashboardWidget = ({ children, style = {} }) => {
  return (
    <section className="card" style={{ padding: '1.5rem', ...style }}>
      {children}
    </section>
  );
};

export const WidgetHeader = ({ title, actionText, actionRoute, onActionClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
      {actionText && (
        <a 
          href={actionRoute || '#'} 
          onClick={onActionClick}
          style={{ color: 'var(--primary-cyan)', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          {actionText}
        </a>
      )}
    </div>
  );
};

export default DashboardWidget;
