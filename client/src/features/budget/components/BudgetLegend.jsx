import React from 'react';

const BudgetLegend = React.memo(({ label, color }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
    <div
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: color,
        flexShrink: 0
      }}
      aria-hidden="true"
    />
    {label}
  </span>
));

export default BudgetLegend;
