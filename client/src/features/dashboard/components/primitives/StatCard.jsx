import React, { memo } from 'react';

const StatCard = memo(({ title, value, icon, iconBgColor, iconColor }) => {
  return (
    <div className="stat-card" style={{
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div className="stat-icon" style={{
        fontSize: '2rem',
        color: iconColor,
        background: iconBgColor,
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
      }}>
        {icon}
      </div>
      <div className="stat-info">
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
          {title}
        </h4>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {value}
        </p>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
