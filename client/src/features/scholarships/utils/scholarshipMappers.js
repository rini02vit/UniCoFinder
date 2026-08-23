/**
 * Normalizes deadline strings into status flags and formatted dates
 */
const normalizeDeadline = (dateString) => {
  if (!dateString) {
    return { status: 'UNKNOWN', formattedDeadline: 'N/A', daysRemaining: null, isExpired: false, originalDeadline: null };
  }

  // Normalize both dates to UTC midnight for consistent daily difference
  const deadlineDate = new Date(dateString);
  deadlineDate.setUTCHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isExpired = daysRemaining < 0;
  
  let status = 'OPEN';
  if (isExpired) status = 'CLOSED';
  else if (daysRemaining <= 30) status = 'CLOSING_SOON';

  const formattedDeadline = new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(deadlineDate);

  return {
    originalDeadline: dateString,
    formattedDeadline,
    daysRemaining,
    status,
    isExpired
  };
};

/**
 * Validates URLs for security
 */
const validateExternalUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch {
    return null; // Invalid URL structure
  }
};

/**
 * Normalizes list items for ScholarshipCard
 */
export const mapScholarshipListItem = (raw) => {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    title: raw.name || raw.title || 'Unknown Scholarship',
    provider: raw.provider || 'Unknown Provider',
    country: raw.country || 'Global',
    fundingType: raw.coverageType || (raw.amount ? `${raw.amount} ${raw.currency || ''}` : 'Varies'),
    deadlineInfo: normalizeDeadline(raw.applicationDeadline || raw.deadline)
  };
};

/**
 * Normalizes detail items for ScholarshipDetailsPage
 */
export const mapScholarshipDetails = (raw) => {
  if (!raw) return null;
  
  return {
    id: raw._id || raw.id,
    title: raw.name || raw.title || 'Unknown Scholarship',
    provider: raw.provider || 'Unknown Provider',
    country: raw.country || 'Global',
    fundingType: raw.coverageType || (raw.amount ? `${raw.amount} ${raw.currency || ''}` : 'Varies'),
    description: raw.description || 'No description provided.',
    benefits: raw.amount ? `Provides ${raw.amount} ${raw.currency || ''} in funding.` : 'No benefits information provided.',
    
    deadlineInfo: normalizeDeadline(raw.applicationDeadline || raw.deadline),
    officialWebsite: validateExternalUrl(raw.website || raw.officialWebsite),

    // Normalized for MetricsGrid consumption
    eligibility: {
      degreeLevel: Array.isArray(raw.degreeLevels) 
        ? raw.degreeLevels.join(', ') 
        : (raw.degreeLevels || 'N/A'),
      targetRegion: Array.isArray(raw.eligibleCountries) ? raw.eligibleCountries.join(', ') : (raw.eligibleCountries || 'Global'),
      minGpa: raw.minimumCgpa ? `${raw.minimumCgpa} / 10.0` : 'Not specified',
      languageReq: Array.isArray(raw.englishExamRequirements) ? raw.englishExamRequirements.join(', ') : (raw.englishExamRequirements || 'N/A')
    }
  };
};
