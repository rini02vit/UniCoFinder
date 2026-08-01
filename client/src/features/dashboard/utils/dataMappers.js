/**
 * Lightweight mapping utilities to isolate UI from backend model changes.
 */

export const mapProfileData = (rawProfile) => {
  if (!rawProfile) return null;
  
  // Calculate profile completion percentages (stubbed logic for UI demonstration)
  // In a real app, this might come from backend or complex client logic
  const academicScore = rawProfile.cgpa ? 100 : (rawProfile.degree ? 50 : 0);
  const preferenceScore = rawProfile.countryPreference ? 100 : (rawProfile.course ? 50 : 0);
  
  return {
    ...rawProfile,
    firstName: rawProfile.name ? rawProfile.name.split(' ')[0] : '',
    completion: {
      academic: academicScore,
      preferences: preferenceScore
    }
  };
};

export const mapWishlistData = (rawWishlist) => {
  if (!Array.isArray(rawWishlist)) return [];
  // Backend returns array of { _id, userId, universityId }
  // Assume universityId is populated with basic university details
  return rawWishlist.map(item => ({
    id: item._id,
    university: item.universityId || {}
  }));
};

export const mapApplicationData = (rawApplications) => {
  if (!Array.isArray(rawApplications)) return [];
  return rawApplications.map(app => ({
    id: app._id,
    status: app.status || 'Pending',
    university: app.universityId || {},
    updatedAt: app.updatedAt
  }));
};

export const mapRecommendationData = (rawItems) => {
  if (!Array.isArray(rawItems)) return [];
  // Generic mapping for both scholarships and countries if they share common fields
  return rawItems.map(item => ({
    id: item._id,
    title: item.title || item.name,
    description: item.description || item.currency || 'Learn more',
    amount: item.amount || null,
    image: item.image || null
  }));
};
