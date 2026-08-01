import React from 'react';
import { StatusBadgeMap } from '../../constants/dashboardConfig';

export const StatusBadge = ({ status }) => {
  const config = StatusBadgeMap[status] || { color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.1)' };
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: config.color,
      backgroundColor: config.bg,
    }}>
      {status}
    </span>
  );
};

export const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="state-container" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <div className="state-icon empty" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 className="state-title" style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p className="state-desc" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        {description}
      </p>
      {actionText && (
        <button className="btn btn-outline" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
