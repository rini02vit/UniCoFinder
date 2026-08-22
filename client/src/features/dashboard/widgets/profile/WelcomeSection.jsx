import React from 'react';
import { 
  useDashboardProfile,
  useDashboardApplications,
  useDashboardWishlist,
  useDashboardScholarships
} from '../../providers/DashboardProvider';
import { getGreetingRule } from '../../constants/dashboardConfig';
import { ROUTES } from '../../../../constants/routes';
const ReportDownloader = React.lazy(() => import('../../../../features/reports/components/ReportDownloader'));

const WelcomeSection = () => {
  const { data: profileData, status: profileStatus } = useDashboardProfile();
  const { data: appData, status: appStatus } = useDashboardApplications();
  const { data: wishlistData, status: wishStatus } = useDashboardWishlist();
  const { data: schData, status: schStatus } = useDashboardScholarships();

  const isSuccess = 
    profileStatus === 'success' && 
    (appStatus === 'success' || appStatus === 'empty') && 
    (wishStatus === 'success' || wishStatus === 'empty') && 
    (schStatus === 'success' || schStatus === 'empty');

  const greeting = profileStatus === 'success' 
    ? getGreetingRule(profileData?.firstName || profileData?.name) 
    : getGreetingRule(null);

  return (
    <>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{greeting} 👋</h2>
        <p className="text-secondary">Here's an overview of your study abroad journey.</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.href = ROUTES.UNIVERSITIES || '/universities'}
        >
          Find Universities
        </button>

        {isSuccess && (
          <React.Suspense fallback={
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', opacity: 0.7 }}>
              Loading Report Generator...
            </button>
          }>
            <ReportDownloader
              type="study-abroad"
              data={{ profileData, appData, wishlistData, schData }}
              fileName="UniCoFinder-Study-Plan.pdf"
              className="btn btn-secondary"
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 500
              }}
            />
          </React.Suspense>
        )}
      </div>
    </>
  );
};

export default WelcomeSection;
