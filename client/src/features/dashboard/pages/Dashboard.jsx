import React from 'react';
import { DashboardProvider } from '../providers/DashboardProvider';
import DashboardLayout from '../components/DashboardLayout';

// Core Integration Widgets
import WelcomeSection from '../widgets/profile/WelcomeSection';
import ProfileSummary from '../widgets/profile/ProfileSummary';
import SavedUniversitiesWidget from '../widgets/universities/SavedUniversitiesWidget';
import ApplicationStatusWidget from '../widgets/applications/ApplicationStatusWidget';

// Scalable Recommendations & Placeholders
import ScholarshipsRecommendation from '../widgets/recommendations/ScholarshipsRecommendation';
import CountriesRecommendation from '../widgets/recommendations/CountriesRecommendation';
import QuickActionsGrid from '../widgets/actions/QuickActionsGrid';
import BudgetPlaceholder from '../widgets/placeholders/BudgetPlaceholder';

// Batch 2 Features
import ActivityFeedWidget from '../widgets/activity/ActivityFeedWidget';
import NotificationsWidget from '../widgets/notifications/NotificationsWidget';

// Stat Cards
import StatCardsConfigurator from '../widgets/stats/StatCardsConfigurator';

const DashboardContent = () => {
  return (
    <DashboardLayout 
      header={<WelcomeSection />}
      stats={<StatCardsConfigurator />}
      main={
        <>
          <ApplicationStatusWidget />
          <SavedUniversitiesWidget />
          <ScholarshipsRecommendation />
          <CountriesRecommendation />
          <ActivityFeedWidget />
        </>
      }
      sidebar={
        <>
          <ProfileSummary />
          <QuickActionsGrid />
          <BudgetPlaceholder />
          <NotificationsWidget />
        </>
      }
    />
  );
};

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
