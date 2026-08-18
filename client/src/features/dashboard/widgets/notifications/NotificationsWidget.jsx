import React from 'react';
import { useDashboardNotifications } from '../../providers/DashboardProvider';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState } from '../../components/primitives/DataDisplays';
import { ListSkeleton } from '../../components/primitives/Skeletons';

const NotificationsWidget = () => {
  const { data: notifications, status, error, refetch } = useDashboardNotifications();

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
        
        {(status === 'empty' || (status === 'success' && (!notifications || notifications.length === 0))) && (
          <EmptyState
            icon="🔔"
            title="No new notifications"
            description="We'll notify you about important updates."
          />
        )}

        {status === 'success' && notifications?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map(notification => {
              // Styling lookup based on semantic type
              let bgColor = 'rgba(245, 158, 11, 0.05)'; // warning
              let borderColor = 'rgba(245, 158, 11, 0.2)';
              
              if (notification.type === 'success') {
                bgColor = 'rgba(16, 185, 129, 0.05)';
                borderColor = 'rgba(16, 185, 129, 0.2)';
              } else if (notification.type === 'info') {
                bgColor = 'rgba(59, 130, 246, 0.05)';
                borderColor = 'rgba(59, 130, 246, 0.2)';
              }

              return (
                <div key={notification.id} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: bgColor,
                  border: '1px solid',
                  borderColor: borderColor,
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
              );
            })}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default NotificationsWidget;
