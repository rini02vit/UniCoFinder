import React from 'react';
import DashboardWidget, { WidgetHeader } from '../../components/primitives/DashboardWidget';
import { EmptyState } from '../../components/primitives/DataDisplays';

const NotificationsPlaceholder = () => {
  return (
    <DashboardWidget>
      <WidgetHeader title="Notifications" />
      {/* Strict placeholder: no mocked arrays or fake API data */}
      <EmptyState
        icon="🔔"
        title="No new notifications"
        description="We'll notify you about application updates, deadlines, and new scholarship opportunities."
      />
    </DashboardWidget>
  );
};

export default NotificationsPlaceholder;
