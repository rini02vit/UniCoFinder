export const COUNTRY_OPTIONS = [
  { value: '', label: 'All Countries' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' }
];

export const BUDGET_OPTIONS = [
  { value: '', label: 'Budget (Any)' },
  { value: 'low', label: '< $20,000' },
  { value: 'medium', label: '$20k - $40k' },
  { value: 'high', label: '> $40k' }
];

export const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'ranking_asc', label: 'Ranking (Highest)' },
  { value: 'tuition_asc', label: 'Tuition (Lowest)' }
];

// Define how statistics from the API map to labels in the details page
export const KEY_STATISTICS_CONFIG = [
  { 
    key: 'qsRanking', 
    label: 'World Ranking (QS)', 
    format: (val) => val ? `#${val}` : 'N/A' 
  },
  { 
    key: 'acceptanceRate', 
    label: 'Acceptance Rate', 
    format: (val) => val ? `${val}%` : 'N/A' 
  },
  { 
    key: 'tuitionFee', 
    label: 'Average Tuition', 
    format: (val) => val ? `$${val.toLocaleString()} / year` : 'N/A' 
  },
  { 
    key: 'livingCost', 
    label: 'Estimated Living Cost', 
    format: (val) => val ? `$${val.toLocaleString()} / year` : 'N/A' 
  },
  { 
    key: 'minCgpa', 
    label: 'Minimum CGPA Required', 
    format: (val) => val ? `${val.toFixed(1)} / 4.0` : 'N/A' 
  }
];
