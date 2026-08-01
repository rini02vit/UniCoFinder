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
    title: raw.title || 'Unknown Scholarship',
    provider: raw.provider || 'Unknown Provider',
    country: raw.country || 'Global',
    fundingType: raw.fundingType || 'Varies',
    deadlineInfo: normalizeDeadline(raw.deadline)
  };
};

/**
 * Normalizes detail items for ScholarshipDetailsPage
 */
export const mapScholarshipDetails = (raw) => {
  if (!raw) return null;
  
  return {
    id: raw._id || raw.id,
    title: raw.title || 'Unknown Scholarship',
    provider: raw.provider || 'Unknown Provider',
    country: raw.country || 'Global',
    fundingType: raw.fundingType || 'Varies',
    description: raw.description || 'No description provided.',
    benefits: raw.benefits || 'No benefits information provided.',
    
    deadlineInfo: normalizeDeadline(raw.deadline),
    officialWebsite: validateExternalUrl(raw.officialWebsite),

    // Normalized for MetricsGrid consumption
    eligibility: {
      degreeLevel: Array.isArray(raw.eligibility?.degreeLevel) 
        ? raw.eligibility.degreeLevel.join(', ') 
        : (raw.eligibility?.degreeLevel || 'N/A'),
      targetRegion: raw.eligibility?.targetRegion || 'N/A',
      minGpa: raw.eligibility?.minGpa ? `${raw.eligibility.minGpa} / 4.0` : 'Not specified',
      languageReq: raw.eligibility?.languageReq || 'N/A'
    }
  };
};
