import React, { createContext, useContext } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import { 
  mapProfileData, 
  mapWishlistData, 
  mapApplicationData, 
  mapRecommendationData 
} from '../utils/dataMappers';
import { useResource } from '../hooks/useResource';

// Split contexts to prevent mass rerenders
const ProfileContext = createContext();
const WishlistContext = createContext();
const ApplicationsContext = createContext();
const ScholarshipsContext = createContext();
const CountriesContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Each resource is fetched independently with its own cancellation and state
  const profileState = useResource(dashboardApi.getProfile, mapProfileData);
  const wishlistState = useResource(dashboardApi.getWishlist, mapWishlistData);
  const applicationsState = useResource(dashboardApi.getApplications, mapApplicationData);
  const scholarshipsState = useResource(dashboardApi.getScholarships, mapRecommendationData);
  const countriesState = useResource(dashboardApi.getRecommendedCountries, mapRecommendationData);

  return (
    <ProfileContext.Provider value={profileState}>
      <WishlistContext.Provider value={wishlistState}>
        <ApplicationsContext.Provider value={applicationsState}>
          <ScholarshipsContext.Provider value={scholarshipsState}>
            <CountriesContext.Provider value={countriesState}>
              {children}
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
