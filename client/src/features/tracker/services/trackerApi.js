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
  },

  /**
   * Updates an application
   * @param {string} id Application ID
   * @param {object} data Fields to update
   */
  updateApplication: async (id, data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to update application');
      }
      return responseData.data.application;
    } catch (error) {
      console.error('Failed to update application', error);
      throw error;
    }
  }
};
