import React from 'react';

const DashboardLayout = ({ header, stats, main, sidebar }) => {
  return (
    <div className="dashboard-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      {/* Header Area */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        {header}
      </header>

      {/* Stats Grid Area */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats}
      </div>

      {/* Main Content Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start' // Prevents widgets from stretching vertically
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {main}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sidebar}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
