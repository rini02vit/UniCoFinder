import React from 'react';
import { useDashboardProfile } from '../../providers/DashboardProvider';
import { getGreetingRule } from '../../constants/dashboardConfig';
import { ROUTES } from '../../../../constants/routes';

const WelcomeSection = () => {
  const { data, status } = useDashboardProfile();

  const greeting = status === 'success' 
    ? getGreetingRule(data?.firstName) 
    : getGreetingRule(null);

  return (
    <>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{greeting} 👋</h2>
        <p className="text-secondary">Here's an overview of your study abroad journey.</p>
      </div>
      <button 
        className="btn btn-primary" 
        onClick={() => window.location.href = ROUTES.UNIVERSITIES || '/universities'}
      >
        Find Universities
      </button>
    </>
  );
};

export default WelcomeSection;
