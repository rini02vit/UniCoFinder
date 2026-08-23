/**
 * Utility to format currencies
 */
const formatCurrency = (amount, currencyCode = 'USD') => {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Maps raw backend country list data to a stable frontend model
 */
export const mapCountryListItem = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown Country',
    region: raw.continent || 'Unknown Region',
    image: raw.image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    avgTuition: raw.averageTuitionFee ? formatCurrency(raw.averageTuitionFee, raw.currency || 'USD') : 'N/A',
    postStudyVisa: raw.postStudyWorkVisa ? 'Available' : 'N/A'
  };
};

/**
 * Maps detailed backend country data for the details page
 */
export const mapCountryDetails = (raw) => {
  if (!raw) return null;
  
  const currency = raw.currency || 'USD';

  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown Country',
    region: raw.continent || 'Unknown Region',
    image: raw.image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80',
    overview: raw.description || 'No overview available for this country.',
    
    // Grouped sections for MetricsGrid consumption
    costs: {
      avgTuition: raw.averageTuitionFee ? formatCurrency(raw.averageTuitionFee, currency) : 'N/A',
      livingCost: raw.averageLivingCost ? formatCurrency(raw.averageLivingCost, currency) : 'N/A',
      proofOfFunds: 'N/A'
    },
    
    visa: {
      type: raw.visaRequirements || 'N/A',
      processingTime: 'N/A',
      difficulty: raw.visaFriendlinessScore ? `${raw.visaFriendlinessScore}/10` : 'Standard'
    },

    employment: {
      partTimeHours: raw.workPermit ? '20 hrs/week' : 'Not allowed',
      postStudyVisa: raw.postStudyWorkVisa ? 'Available' : 'N/A',
      minWage: 'N/A'
    },

    // Transform embedded Top Universities precisely into the UniversityCard model
    topUniversities: (raw.topUniversities || []).map(uni => ({
      id: uni._id || uni.id,
      name: uni.name || 'Unknown University',
      location: `${uni.city || 'Unknown City'}, ${uni.country || raw.name}`,
      image: uni.image || uni.images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      ranking: uni.ranking || null,
      matchStatus: uni.matchStatus || null,
      tuition: uni.tuitionFee || null,
      acceptanceRate: uni.acceptanceRate || null
    }))
  };
};
