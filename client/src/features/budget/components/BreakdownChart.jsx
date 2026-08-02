import React from 'react';

const BreakdownChart = React.memo(({ segments }) => {
  return (
    <div>
      {/* Visual Bar */}
      <div
        aria-hidden="true"
        style={{
          width: '100%',
          height: '20px',
          borderRadius: '10px',
          display: 'flex',
          overflow: 'hidden',
          marginBottom: '1rem',
          background: 'var(--border-color)' // Fallback empty state
        }}
      >
        {segments.map(seg => (
          seg.id !== 'empty' && (
            <div
              key={seg.id}
              style={{
                background: seg.color,
                width: `${seg.widthPercentage}%`,
                transition: 'width 0.3s ease-in-out'
              }}
              title={`${seg.label} (${seg.widthPercentage.toFixed(1)}%)`}
            />
          )
        ))}
      </div>

      {/* Screen Reader Only text for the chart */}
      <div className="sr-only">
        Cost breakdown: 
        {segments.map(seg => (
          seg.id === 'empty' 
            ? 'No expenses logged.' 
            : `${seg.label} accounts for ${seg.widthPercentage.toFixed(1)} percent.`
        )).join(' ')}
      </div>
    </div>
  );
});

export default BreakdownChart;
