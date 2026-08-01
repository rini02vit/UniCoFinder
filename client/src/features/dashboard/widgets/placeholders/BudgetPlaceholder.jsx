import React from 'react';
import DashboardWidget from '../../components/primitives/DashboardWidget';

const BudgetPlaceholder = () => {
  return (
    <DashboardWidget>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Budget Overview</h3>
      <div style={{ textAlign: 'center', padding: '2rem 1rem', opacity: 0.7 }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Connect your target universities to see detailed budget breakdowns.
        </p>
        {/* Placeholder UI - NO logic or fabricated math */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', marginBottom: '0.5rem' }}>
           <div style={{ width: '60%', height: '100%', background: 'var(--warning)', borderRadius: '4px' }}></div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Target Budget: Not set
        </span>
      </div>
    </DashboardWidget>
  );
};

export default BudgetPlaceholder;
