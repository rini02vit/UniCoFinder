import { authApi } from '../../auth/services/authApi';

/**
 * Service to manage profile data.
 * Reuses authApi for fetching, and simulates updating to avoid inventing backend routes.
 */
export const profileApi = {
  /**
   * Fetch current user profile.
   * Relies on the existing authApi /me endpoint.
   */
  getProfile: async () => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      console.error('Failed to fetch profile', error);
      throw error;
    }
  },

  /**
   * Update current user profile.
   * MOCKED: Simulates a network request since no /api/profile/update exists.
   * @param {Object} formData 
   */
  updateProfile: async (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a successful update and echo back the data
        resolve({ ...formData, updatedAt: new Date().toISOString() });
      }, 1000);
    });
  }
};
