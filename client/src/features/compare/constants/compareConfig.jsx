import React from 'react';

export const MAX_COMPARE_LIMIT = 4;

export const COMPARE_METRICS_CONFIG = [
  { 
    key: 'country', 
    label: 'Country', 
    formatter: (uni) => uni.location?.country || 'N/A' 
  },
  { 
    key: 'ranking', 
    label: 'World Ranking', 
    formatter: (uni) => uni.ranking?.qs ? `#${uni.ranking.qs}` : 'N/A' 
  },
  { 
    key: 'acceptanceRate', 
    label: 'Acceptance Rate', 
    formatter: (uni) => uni.stats?.acceptanceRate ? (
      <span style={{ 
        color: uni.stats.acceptanceRate < 10 ? 'var(--danger)' : 
               uni.stats.acceptanceRate < 30 ? 'var(--warning)' : 'inherit'
      }}>
        {uni.stats.acceptanceRate}%
      </span>
    ) : 'N/A' 
  },
  { 
    key: 'tuition', 
    label: 'Tuition Fee (Annual)', 
    formatter: (uni) => uni.stats?.tuitionFee ? `$${uni.stats.tuitionFee.toLocaleString()}` : 'N/A' 
  },
  { 
    key: 'livingCost', 
    label: 'Living Cost (Annual)', 
    // Mock living cost as it's not directly in stats right now
    formatter: (uni) => uni.stats?.livingCost ? `$${uni.stats.livingCost.toLocaleString()}` : 'Varies' 
  },
  { 
    key: 'scholarships', 
    label: 'Scholarships', 
    formatter: () => <span className="badge badge-green">Available</span> 
  }
];
