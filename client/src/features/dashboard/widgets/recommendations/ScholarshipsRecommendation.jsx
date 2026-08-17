import React from 'react';
import { useDashboardScholarships } from '../../providers/DashboardProvider';
import RecommendationWidget from './RecommendationWidget';
import { ROUTES } from '../../../../constants/routes';

const ScholarshipsRecommendation = () => {
  const { data, status, error, refetch } = useDashboardScholarships();

  const renderItem = (item) => (
    <div key={item.id} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: 'var(--primary-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        🎓
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.title}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {item.description}
        </span>
      </div>
      {item.amount && (
        <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>
          ${item.amount.toLocaleString()}
        </span>
      )}
    </div>
  );

  return (
    <RecommendationWidget
      title="Scholarship Suggestions"
      actionText="View All"
      actionRoute={ROUTES.SCHOLARSHIPS || '/scholarships'}
      status={status}
      error={error}
      data={data?.items?.slice(0, 3)}
      refetch={refetch}
      emptyIcon="🎓"
      emptyTitle="No scholarships found"
      emptyDescription="Complete your profile to get personalized scholarship recommendations."
      emptyActionText="Update Profile"
      emptyActionRoute={ROUTES.PROFILE || '/profile'}
      renderItem={renderItem}
    />
  );
};

export default ScholarshipsRecommendation;
