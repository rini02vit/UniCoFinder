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
import NotificationsPlaceholder from '../widgets/placeholders/NotificationsPlaceholder';

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
        </>
      }
      sidebar={
        <>
          <ProfileSummary />
          <QuickActionsGrid />
          <BudgetPlaceholder />
          <NotificationsPlaceholder />
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
