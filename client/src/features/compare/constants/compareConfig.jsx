import React from 'react';

export const MAX_COMPARE_LIMIT = 4;

export const COMPARE_METRICS_CONFIG = [
  { 
    key: 'country', 
    label: 'Country', 
    formatter: (uni) => uni.country || uni.location?.country || 'N/A' 
  },
  { 
    key: 'ranking', 
    label: 'World Ranking', 
    formatter: (uni) => uni.ranking ? `#${uni.ranking}` : (uni.ranking?.qs ? `#${uni.ranking.qs}` : 'N/A') 
  },
  { 
    key: 'acceptanceRate', 
    label: 'Acceptance Rate', 
    formatter: (uni) => {
      const rate = uni.acceptanceRate || uni.stats?.acceptanceRate;
      return rate ? (
        <span style={{ 
          color: rate < 10 ? 'var(--danger)' : 
                 rate < 30 ? 'var(--warning)' : 'inherit'
        }}>
          {rate}%
        </span>
      ) : 'N/A';
    }
  },
  { 
    key: 'tuition', 
    label: 'Tuition Fee (Annual)', 
    formatter: (uni) => {
      const fee = uni.tuitionFee || uni.stats?.tuitionFee;
      return fee ? `$${fee.toLocaleString()}` : 'N/A';
    }
  },
  { 
    key: 'livingCost', 
    label: 'Living Cost (Annual)', 
    formatter: (uni) => {
      const cost = uni.livingCost || uni.stats?.livingCost;
      return cost ? `$${cost.toLocaleString()}` : 'Varies';
    }
  },
  { 
    key: 'scholarships', 
    label: 'Scholarships', 
    formatter: () => <span className="badge badge-green">Available</span> 
  }
];
