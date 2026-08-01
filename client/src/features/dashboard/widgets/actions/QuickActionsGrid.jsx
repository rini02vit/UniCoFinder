import React from 'react';
import DashboardWidget from '../../components/primitives/DashboardWidget';
import { ROUTES } from '../../../../constants/routes';

const QUICK_ACTIONS = [
  { title: 'Find Universities', icon: '🏫', route: ROUTES.UNIVERSITIES || '/universities', color: 'var(--primary-cyan)' },
  { title: 'Browse Scholarships', icon: '🎓', route: ROUTES.SCHOLARSHIPS || '/scholarships', color: 'var(--primary-green)' },
  { title: 'Compare Options', icon: '⚖️', route: ROUTES.COMPARE || '/compare', color: 'var(--primary-purple)' },
  { title: 'Update Profile', icon: '👤', route: ROUTES.PROFILE || '/profile', color: 'var(--warning)' }
];

const QuickActionsGrid = () => {
  return (
    <DashboardWidget>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Quick Actions</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem' 
      }}>
        {QUICK_ACTIONS.map((action, idx) => (
          <a
            key={idx}
            href={action.route}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.2s',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{action.icon}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{action.title}</span>
          </a>
        ))}
      </div>
    </DashboardWidget>
  );
};

export default QuickActionsGrid;
