import React from 'react';
import { useDashboardCountries } from '../../providers/DashboardProvider';
import RecommendationWidget from './RecommendationWidget';
import { ROUTES } from '../../../../constants/routes';

const CountriesRecommendation = () => {
  const { data, status, error, refetch } = useDashboardCountries();

  const renderItem = (item) => {
    // Assuming score is between 0-100. If missing, fallback to 0.
    const scoreVal = item.score || 0; 
    const percentage = scoreVal <= 10 && scoreVal > 0 ? scoreVal * 10 : scoreVal;
    
    return (
      <div key={item.id} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🌍 {item.title}
          </span>
          <span className="text-gradient" style={{ fontWeight: 'bold' }}>
            {percentage > 0 ? `${Math.round(percentage)}% Match` : 'Analyzing...'}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'var(--gradient-btn)',
            borderRadius: '4px',
            transition: 'width 1s ease-in-out'
          }}></div>
        </div>
        {item.description && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>
            {item.description}
          </span>
        )}
      </div>
    );
  };

  return (
    <RecommendationWidget
      title="Country Match Graph"
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
