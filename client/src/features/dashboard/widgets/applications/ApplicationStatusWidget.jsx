import React from 'react';
import { useDashboardApplications } from '../../providers/DashboardProvider';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState, StatusBadge } from '../../components/primitives/DataDisplays';
import { ListSkeleton } from '../../components/primitives/Skeletons';
import { ROUTES } from '../../../../constants/routes';

const ApplicationStatusWidget = () => {
  const { data, status, error, refetch } = useDashboardApplications();

  return (
    <DashboardWidget>
      <WidgetHeader 
        title="Recent Applications" 
        actionText="View All" 
        actionRoute={ROUTES.APPLICATIONS || '/tracker'} 
      />
      
      <div aria-live="polite">
        {status === 'loading' && <ListSkeleton rows={2} />}
        
        {status === 'error' && (
          <EmptyState 
            icon="⚠️" 
            title="Unable to load applications" 
            description={error?.message || "There was a problem loading your applications."}
            actionText="Retry"
            onAction={refetch}
          />
        )}
        
        {status === 'empty' && (
          <EmptyState 
            icon="📋" 
            title="No applications yet" 
            description="You haven't started any university applications. Explore universities and start your journey!"
            actionText="Explore Universities"
            onAction={() => window.location.href = ROUTES.UNIVERSITIES || '/universities'}
          />
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.slice(0, 3).map(app => (
              <div key={app.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{app.university?.name || 'Unknown University'}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default ApplicationStatusWidget;
