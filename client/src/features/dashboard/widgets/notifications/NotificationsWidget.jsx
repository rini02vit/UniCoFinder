import React, { useMemo } from 'react';
import { useDashboardApplications } from '../../providers/DashboardProvider';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState } from '../../components/primitives/DataDisplays';
import { ListSkeleton } from '../../components/primitives/Skeletons';

const NotificationsWidget = () => {
  const { data, status, error, refetch } = useDashboardApplications();

  // Dynamically derive actionable notifications based on current application state
  const notifications = useMemo(() => {
    if (status !== 'success' || !data) return [];
    
    return data
      .filter(app => app.status === 'Accepted' || app.status === 'Waitlisted')
      .map(app => {
        if (app.status === 'Accepted') {
          return {
            id: app.id,
            type: 'success',
            icon: '🎉',
            title: `Accepted!`,
            message: `Your application to ${app.university?.name || 'Unknown University'} has been accepted.`,
          };
        }
        if (app.status === 'Waitlisted') {
          return {
            id: app.id,
            type: 'warning',
            icon: '⏳',
            title: `Waitlisted`,
            message: `Your application to ${app.university?.name || 'Unknown University'} is currently waitlisted.`,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [data, status]);

  return (
    <DashboardWidget>
      <WidgetHeader title="Notifications" />
      
      <div aria-live="polite">
        {status === 'loading' && <ListSkeleton rows={2} />}
        
        {status === 'error' && (
          <EmptyState 
            icon="⚠️" 
            title="Unable to load notifications" 
            description={error?.message || "There was a problem checking for notifications."}
            actionText="Retry"
            onAction={refetch}
          />
        )}
        
        {(status === 'empty' || (status === 'success' && notifications.length === 0)) && (
          <EmptyState
            icon="🔔"
            title="No new notifications"
            description="We'll notify you about important application updates."
          />
        )}

        {status === 'success' && notifications.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map(notification => (
              <div key={notification.id} style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: notification.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.05)' 
                  : 'rgba(245, 158, 11, 0.05)',
                border: '1px solid',
                borderColor: notification.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : 'rgba(245, 158, 11, 0.2)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {notification.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {notification.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default NotificationsWidget;
