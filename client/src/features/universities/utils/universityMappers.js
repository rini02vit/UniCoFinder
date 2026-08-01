/**
 * Maps raw backend university list data to a stable frontend model
 */
export const mapUniversityListItem = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown University',
    location: `${raw.location?.city || 'Unknown City'}, ${raw.location?.country || 'Unknown Country'}`,
    image: raw.images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    ranking: raw.ranking?.qs || null,
    matchStatus: raw.matchStatus || 'Unknown',
    tuition: raw.stats?.tuitionFee || null,
    acceptanceRate: raw.stats?.acceptanceRate || null
  };
};

/**
 * Maps detailed backend university data for the details page
 */
export const mapUniversityDetails = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown University',
    location: `${raw.location?.city || 'Unknown'}, ${raw.location?.country || 'Unknown'}`,
    image: raw.images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    description: raw.description || `${raw.name} is a leading institution in ${raw.location?.country || 'the world'}.`,
    
    // Statistics for the mapping config
    stats: {
      qsRanking: raw.ranking?.qs,
      acceptanceRate: raw.stats?.acceptanceRate,
      tuitionFee: raw.stats?.tuitionFee,
      livingCost: raw.stats?.livingCost || 25000, // Fallback for mock
      minCgpa: raw.stats?.minCgpa
    },
    
    // Predictor data
    predictor: {
      score: raw.predictorScore || 78, // Mock fallback
      status: raw.matchStatus || 'Safe Match',
      note: 'Based on your CGPA and test scores.'
    },

    // Boolean states
    isWishlisted: raw.isWishlisted || false,
    hasApplied: raw.hasApplied || false
  };
};
