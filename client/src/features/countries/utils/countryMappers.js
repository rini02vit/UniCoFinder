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
    region: raw.region || 'Unknown Region',
    image: raw.images?.cover || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    avgTuition: raw.costs?.avgTuition ? formatCurrency(raw.costs.avgTuition, raw.costs.currency) : 'N/A',
    postStudyVisa: raw.employment?.postStudyVisa || 'N/A'
  };
};

/**
 * Maps detailed backend country data for the details page
 */
export const mapCountryDetails = (raw) => {
  if (!raw) return null;
  
  const currency = raw.costs?.currency || 'USD';

  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown Country',
    region: raw.region || 'Unknown Region',
    image: raw.images?.cover || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80',
    overview: raw.overview || 'No overview available for this country.',
    
    // Grouped sections for MetricsGrid consumption
    costs: {
      avgTuition: raw.costs?.avgTuition ? formatCurrency(raw.costs.avgTuition, currency) : 'N/A',
      livingCost: raw.costs?.livingCost ? formatCurrency(raw.costs.livingCost, currency) : 'N/A',
      proofOfFunds: raw.visa?.proofOfFunds ? formatCurrency(raw.visa.proofOfFunds, currency) : 'N/A'
    },
    
    visa: {
      type: raw.visa?.type || 'N/A',
      processingTime: raw.visa?.processingTime || 'N/A',
      difficulty: raw.visa?.difficulty || 'Standard'
    },

    employment: {
      partTimeHours: raw.employment?.partTimeHours ? `${raw.employment.partTimeHours} hrs/week` : 'Not allowed',
      postStudyVisa: raw.employment?.postStudyVisa || 'N/A',
      minWage: raw.employment?.minWage ? `${formatCurrency(raw.employment.minWage, currency)}/hr` : 'N/A'
    },

    // Transform embedded Top Universities precisely into the UniversityCard model
    topUniversities: (raw.topUniversities || []).map(uni => ({
      id: uni._id || uni.id,
      name: uni.name || 'Unknown University',
      location: `${uni.location?.city || 'Unknown City'}, ${uni.location?.country || raw.name}`,
      image: uni.images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      ranking: uni.ranking?.qs || null,
      matchStatus: uni.matchStatus || 'Unknown',
      tuition: uni.stats?.tuitionFee || null,
      acceptanceRate: uni.stats?.acceptanceRate || null
    }))
  };
};
