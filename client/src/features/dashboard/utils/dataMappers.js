/**
 * Lightweight mapping utilities to isolate UI from backend model changes.
 */

export const mapProfileData = (rawProfile) => {
  if (!rawProfile) return null;
  
  const academicFields = ['cgpa', 'degree', 'englishExam', 'examScore'];
  const filledAcademic = academicFields.filter(f => rawProfile[f] !== undefined && rawProfile[f] !== null).length;
  const academicScore = Math.round((filledAcademic / academicFields.length) * 100);
  
  const preferenceFields = ['course', 'countryPreference', 'budget'];
  const filledPreference = preferenceFields.filter(f => rawProfile[f] !== undefined && rawProfile[f] !== null).length;
  const preferenceScore = Math.round((filledPreference / preferenceFields.length) * 100);
  
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
  // Backend returns array of populated university objects
  return rawWishlist.map(item => ({
    id: item._id,
    university: item
  }));
};

export const mapApplicationData = (rawApplications) => {
  if (!Array.isArray(rawApplications)) return [];
  return rawApplications.map(app => ({
    id: app._id,
    status: app.status || 'Pending',
    university: app.university || {},
    updatedAt: app.updatedAt
  }));
};

export const mapRecommendationData = (rawItems) => {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map(item => ({
    id: item._id,
    title: item.title || item.name,
    name: item.name,
    description: item.description || item.currency || 'Learn more',
    amount: item.amount || null,
    image: item.image || null,
    score: item.score || item.matchPercentage || null,
    applicationDeadline: item.applicationDeadline || null
  }));
};

export const mapScholarshipData = (rawResult) => {
  if (!rawResult || !Array.isArray(rawResult.items)) return { items: [], total: 0 };
  return {
    total: rawResult.total,
    items: mapRecommendationData(rawResult.items)
  };
};
