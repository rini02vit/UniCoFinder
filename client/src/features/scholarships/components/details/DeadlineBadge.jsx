import React from 'react';
import { DEADLINE_STATUS_MAP } from '../../constants/scholarshipsConfig';

const DeadlineBadge = ({ deadlineInfo }) => {
  const { status, formattedDeadline, isExpired } = deadlineInfo;
  
  const config = DEADLINE_STATUS_MAP[status] || DEADLINE_STATUS_MAP.UNKNOWN;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <span className={`badge ${config.className}`}>
        <span aria-hidden="true" style={{ marginRight: '0.25rem' }}>{config.icon}</span>
        {config.label}
        {/* Hidden text for screen readers if color is the only indicator */}
        <span className="sr-only">, Deadline Status: {config.label}</span>
      </span>
      <span 
        className="text-secondary" 
        style={{ 
          fontSize: '0.9rem',
          textDecoration: isExpired ? 'line-through' : 'none'
        }}
      >
        {formattedDeadline}
      </span>
    </div>
  );
};

export default DeadlineBadge;
