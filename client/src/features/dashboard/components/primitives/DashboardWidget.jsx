import React from 'react';
import { Link } from 'react-router-dom';

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
        <Link 
          to={actionRoute || '#'} 
          onClick={onActionClick}
          style={{ color: 'var(--primary-cyan)', textDecoration: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default DashboardWidget;
