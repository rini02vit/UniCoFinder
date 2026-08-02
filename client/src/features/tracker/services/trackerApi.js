import { dashboardApi } from '../../dashboard/services/dashboardApi';

/**
 * Service to manage application tracker data.
 * Reuses the existing dashboardApi backend contract to avoid inventing endpoints.
 */
export const trackerApi = {
  /**
   * Fetches applications.
   * Internally leverages the existing mock from dashboardApi.
   * @param {AbortSignal} signal 
   */
  getApplications: async (signal) => {
    try {
      const data = await dashboardApi.getApplications(signal);
      return data;
    } catch (error) {
      console.error('Failed to fetch tracker applications', error);
      throw error;
    }
  }
};
