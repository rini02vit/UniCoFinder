import React from 'react';
import { useDashboardCountries } from '../../providers/DashboardProvider';
import RecommendationWidget from './RecommendationWidget';
import { ROUTES } from '../../../../constants/routes';

const CountriesRecommendation = () => {
  const { data, status, error, refetch } = useDashboardCountries();

  const renderItem = (item) => (
    <div key={item.id} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      e.currentTarget.style.borderColor = 'var(--primary-cyan)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
    }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        🌍
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.title}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {item.description}
        </span>
      </div>
      <span style={{ color: 'var(--primary-cyan)' }}>→</span>
    </div>
  );

  return (
    <RecommendationWidget
      title="Recommended Countries"
      actionText="Explore All"
      actionRoute={ROUTES.COUNTRIES || '/countries'}
      status={status}
      error={error}
      data={data}
      refetch={refetch}
      emptyIcon="🌍"
      emptyTitle="No countries recommended yet"
      emptyDescription="Add your budget and preferences to discover the best countries for you."
      emptyActionText="Update Preferences"
      emptyActionRoute={ROUTES.PROFILE || '/profile'}
      renderItem={renderItem}
    />
  );
};

export default CountriesRecommendation;
