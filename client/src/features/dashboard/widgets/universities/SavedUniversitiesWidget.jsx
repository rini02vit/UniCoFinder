import React from 'react';
import { useDashboardWishlist } from '../../providers/DashboardProvider';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState } from '../../components/primitives/DataDisplays';
import { ListSkeleton } from '../../components/primitives/Skeletons';
import { ROUTES } from '../../../../constants/routes';

const SavedUniversitiesWidget = () => {
  const { data, status, error, refetch } = useDashboardWishlist();

  return (
    <DashboardWidget>
      <WidgetHeader 
        title="Saved Universities" 
        actionText="View All" 
        actionRoute={ROUTES.WISHLIST || '/wishlist'} 
      />
      
      <div aria-live="polite">
        {status === 'loading' && <ListSkeleton rows={2} />}
        
        {status === 'error' && (
          <EmptyState 
            icon="⚠️" 
            title="Unable to load wishlist" 
            description={error?.message || "There was a problem loading your saved universities."}
            actionText="Retry"
            onAction={refetch}
          />
        )}
        
        {status === 'empty' && (
          <EmptyState 
            icon="🏫" 
            title="No saved universities yet" 
            description="You haven't saved any universities to your wishlist."
            actionText="Explore Universities"
            onAction={() => window.location.href = ROUTES.UNIVERSITIES || '/universities'}
          />
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.slice(0, 3).map(item => (
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
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  🏫
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.university?.name || 'Unknown University'}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {item.university?.country || 'Unknown Country'}
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

export default SavedUniversitiesWidget;
