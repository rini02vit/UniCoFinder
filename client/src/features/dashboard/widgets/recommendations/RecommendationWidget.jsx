import React from 'react';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState } from '../../components/primitives/DataDisplays';
import { ListSkeleton } from '../../components/primitives/Skeletons';

const RecommendationWidget = ({ 
  title, 
  actionText, 
  actionRoute,
  status,
  error,
  data,
  refetch,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyActionText,
  emptyActionRoute,
  renderItem
}) => {
  return (
    <DashboardWidget>
      <WidgetHeader 
        title={title} 
        actionText={actionText} 
        actionRoute={actionRoute} 
      />
      
      <div aria-live="polite">
        {status === 'loading' && <ListSkeleton rows={2} />}
        
        {status === 'error' && (
          <EmptyState 
            icon="⚠️" 
            title={`Unable to load ${title.toLowerCase()}`}
            description={error?.message || "There was a problem loading recommendations."}
            actionText="Retry"
            onAction={refetch}
          />
        )}
        
        {status === 'empty' && (
          <EmptyState 
            icon={emptyIcon} 
            title={emptyTitle} 
            description={emptyDescription}
            actionText={emptyActionText}
            onAction={() => window.location.href = emptyActionRoute || '#'}
          />
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.slice(0, 3).map(renderItem)}
          </div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default RecommendationWidget;
