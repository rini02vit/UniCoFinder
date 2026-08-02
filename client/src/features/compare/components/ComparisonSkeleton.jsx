import React from 'react';
import { COMPARE_METRICS_CONFIG } from '../constants/compareConfig';

export const ComparisonSkeleton = () => {
  // Simulate 3 columns of skeleton data
  const mockColumns = [1, 2, 3];

  return (
    <div style={{ overflowX: 'auto' }} aria-hidden="true">
      <table className="compare-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <thead>
          <tr>
            <th style={{ minWidth: '200px', padding: '1.5rem' }}>
              <div className="skeleton-line" style={{ width: '60px', height: '20px' }}></div>
            </th>
            {mockColumns.map(i => (
              <th key={i} style={{ minWidth: '250px', padding: '1.5rem', borderLeft: '1px solid var(--border-color)' }}>
                <div className="skeleton-image" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                <div className="skeleton-line" style={{ width: '120px', height: '24px', margin: '0 auto 0.5rem' }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: '36px', borderRadius: '8px' }}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_METRICS_CONFIG.map(metric => (
            <tr key={metric.key}>
              <th style={{ textAlign: 'left', padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                {metric.label}
              </th>
              {mockColumns.map(i => (
                <td key={i} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
                  <div className="skeleton-line" style={{ width: '80%', height: '20px', margin: '0 auto' }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
