import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardProfile } from '../../providers/DashboardProvider';
import DashboardWidget from '../../components/primitives/DashboardWidget';
import { ProfileSkeleton } from '../../components/primitives/Skeletons';
import { EmptyState } from '../../components/primitives/DataDisplays';

const ProfileSummary = () => {
  const { data, status, error, refetch } = useDashboardProfile();

  if (status === 'loading') {
    return (
      <DashboardWidget>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Profile Completion</h3>
        <ProfileSkeleton />
      </DashboardWidget>
    );
  }

  if (status === 'error') {
    return (
      <DashboardWidget>
        <EmptyState 
          icon="⚠️" 
          title="Failed to load profile" 
          description={error?.message || 'Something went wrong.'}
          actionText="Try Again"
          onAction={refetch}
        />
      </DashboardWidget>
    );
  }

  const { academic = 0, preferences = 0 } = data?.completion || {};

  return (
    <DashboardWidget>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Profile Completion</h3>
      
      {/* Academic Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>Academic Details</span>
        <span className="text-gradient">{academic}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <div style={{ width: `${academic}%`, height: '100%', background: 'var(--gradient-btn)', borderRadius: '4px' }}></div>
      </div>

      {/* Preferences */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>Preferences</span>
        <span className="text-gradient">{preferences}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <div style={{ width: `${preferences}%`, height: '100%', background: 'var(--gradient-btn)', borderRadius: '4px' }}></div>
      </div>

      <Link to="/profile" className="btn btn-secondary btn-block" style={{ display: 'block', textAlign: 'center', boxSizing: 'border-box' }}>
        Complete Profile
      </Link>
    </DashboardWidget>
  );
};

export default ProfileSummary;
