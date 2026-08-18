import React, { createContext, useContext } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import { 
  mapProfileData, 
  mapWishlistData, 
  mapApplicationData, 
  mapRecommendationData,
  mapScholarshipData 
} from '../utils/dataMappers';
import { useResource } from '../hooks/useResource';

// Split contexts to prevent mass rerenders
const ProfileContext = createContext();
const WishlistContext = createContext();
const ApplicationsContext = createContext();
const ScholarshipsContext = createContext();
const CountriesContext = createContext();
const NotificationsContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Each resource is fetched independently with its own cancellation and state
  const profileState = useResource(dashboardApi.getProfile, mapProfileData);
  const wishlistState = useResource(dashboardApi.getWishlist, mapWishlistData);
  const applicationsState = useResource(dashboardApi.getApplications, mapApplicationData);
  const scholarshipsState = useResource(dashboardApi.getScholarships, mapScholarshipData);
  const countriesState = useResource(dashboardApi.getRecommendedCountries, mapRecommendationData);
  const notificationsState = useResource(dashboardApi.getNotifications, (data) => data);

  return (
    <ProfileContext.Provider value={profileState}>
      <WishlistContext.Provider value={wishlistState}>
        <ApplicationsContext.Provider value={applicationsState}>
          <ScholarshipsContext.Provider value={scholarshipsState}>
            <CountriesContext.Provider value={countriesState}>
              <NotificationsContext.Provider value={notificationsState}>
                {children}
              </NotificationsContext.Provider>
            </CountriesContext.Provider>
          </ScholarshipsContext.Provider>
        </ApplicationsContext.Provider>
      </WishlistContext.Provider>
    </ProfileContext.Provider>
  );
};

// Split hooks for targeted consumption
export const useDashboardProfile = () => useContext(ProfileContext);
export const useDashboardWishlist = () => useContext(WishlistContext);
export const useDashboardApplications = () => useContext(ApplicationsContext);
export const useDashboardScholarships = () => useContext(ScholarshipsContext);
export const useDashboardCountries = () => useContext(CountriesContext);
export const useDashboardNotifications = () => useContext(NotificationsContext);
