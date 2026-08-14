import React from 'react';
import { useDashboardApplications } from '../../providers/DashboardProvider';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState } from '../../components/primitives/DataDisplays';
import { ListSkeleton } from '../../components/primitives/Skeletons';

const getActivityDescription = (status, universityName) => {
  switch (status) {
    case 'Planning':
      return `Started planning application for ${universityName}`;
    case 'Applied':
      return `Submitted application to ${universityName}`;
    case 'Under Review':
      return `Application for ${universityName} is under review`;
    case 'Waitlisted':
      return `Waitlisted by ${universityName}`;
    case 'Accepted':
      return `Accepted by ${universityName}! 🎉`;
    case 'Rejected':
      return `Application to ${universityName} was unsuccessful`;
    default:
      return `Application for ${universityName} updated`;
  }
};

const ActivityFeedWidget = () => {
  const { data, status, error, refetch } = useDashboardApplications();

  return (
    <DashboardWidget>
      <WidgetHeader title="Recent Application Activity" />
      
      <div aria-live="polite">
        {status === 'loading' && <ListSkeleton rows={3} />}
        
        {status === 'error' && (
          <EmptyState 
            icon="⚠️" 
            title="Unable to load activity" 
            description={error?.message || "There was a problem loading your activity feed."}
            actionText="Retry"
            onAction={refetch}
          />
        )}
        
        {status === 'empty' && (
          <EmptyState 
            icon="🕒" 
            title="No recent activity" 
            description="Your recent application updates will appear here."
          />
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0' }}>
            {data.slice(0, 5).map((app, index) => (
              <div key={app.id} style={{
                display: 'flex',
                gap: '1rem',
                position: 'relative'
              }}>
                {/* Timeline vertical line */}
                {index !== Math.min(data.length, 5) - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '11px',
                    top: '24px',
                    bottom: '-1.5rem',
                    width: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0
                  }} />
                )}
                
                {/* Timeline dot */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  zIndex: 1,
                  boxShadow: '0 0 0 4px var(--bg-card)'
                }}>
                  📝
                </div>
                
                <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {getActivityDescription(app.status, app.university?.name || 'Unknown University')}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default ActivityFeedWidget;
