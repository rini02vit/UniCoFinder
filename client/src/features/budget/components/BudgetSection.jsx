import React from 'react';

const BudgetSection = ({ title, children }) => (
  <section style={{ marginBottom: '1rem' }}>
    {title && (
      <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </h4>
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {children}
    </div>
  </section>
);

export default BudgetSection;
