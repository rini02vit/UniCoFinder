/**
 * Maps raw backend university list data to a stable frontend model
 */
export const mapUniversityListItem = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown University',
    location: `${raw.city || 'Unknown City'}, ${raw.country || 'Unknown Country'}`,
    image: raw.image || raw.images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    ranking: raw.ranking || null,
    matchStatus: raw.matchStatus || null,
    tuition: raw.tuitionFee || null,
    acceptanceRate: raw.acceptanceRate || null
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
    location: `${raw.city || 'Unknown City'}, ${raw.country || 'Unknown Country'}`,
    image: raw.image || raw.images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    description: raw.description || `${raw.name} is a leading institution in ${raw.country || 'the world'}.`,
    
    // Statistics for the mapping config
    stats: {
      qsRanking: raw.ranking,
      acceptanceRate: raw.acceptanceRate,
      tuitionFee: raw.tuitionFee,
      livingCost: raw.livingCost || 25000, 
      minCgpa: raw.cgpaRequirement
    },
    
    // Predictor data
    predictor: {
      score: raw.matchPercentage || raw.predictorScore || 78, 
      status: raw.matchStatus || 'Safe Match',
      note: 'Based on your CGPA and test scores.'
    },

    // Boolean states
    isWishlisted: raw.isWishlisted || false,
    hasApplied: raw.hasApplied || false
  };
};
