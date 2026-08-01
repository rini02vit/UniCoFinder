import React from 'react';
import { useDashboardProfile, useDashboardWishlist, useDashboardApplications, useDashboardScholarships } from '../../providers/DashboardProvider';
import { DashboardMetricsConfig } from '../../constants/dashboardConfig';
import StatCard from '../../components/primitives/StatCard';
import { StatCardSkeleton } from '../../components/primitives/Skeletons';

const StatCardsConfigurator = () => {
  const profile = useDashboardProfile();
  const wishlist = useDashboardWishlist();
  const applications = useDashboardApplications();
  const scholarships = useDashboardScholarships();

  const isAnyLoading = [profile, wishlist, applications, scholarships].some(res => res.status === 'loading');

  if (isAnyLoading) {
    return (
      <>
        {DashboardMetricsConfig.map(config => (
          <StatCardSkeleton key={config.id} />
        ))}
      </>
    );
  }

  // Aggregate data for the config functions
  const aggregatedData = {
    profile: profile.data,
    wishlist: wishlist.data,
    applications: applications.data,
    scholarships: scholarships.data
  };

  return (
    <>
      {DashboardMetricsConfig.map(config => (
        <StatCard
          key={config.id}
          title={config.title}
          icon={config.icon}
          iconBgColor={config.iconBgColor}
          iconColor={config.iconColor}
          value={config.getValue(aggregatedData)}
        />
      ))}
    </>
  );
};

export default StatCardsConfigurator;
