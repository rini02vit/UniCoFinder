import React from 'react';
import { COMPARE_METRICS_CONFIG } from '../constants/compareConfig';

const CompareTable = React.memo(({ universities, onRemove }) => {
  if (!universities || universities.length === 0) return null;

  return (
    <div style={{ overflowX: 'auto' }} tabIndex="0" aria-label="Comparison Table">
      <table className="compare-table" style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <thead>
          <tr>
            <th scope="col" style={{ position: 'sticky', left: 0, background: 'var(--card-bg)', zIndex: 1, minWidth: '200px' }}>
              Feature
            </th>
            {universities.map(uni => (
              <th scope="col" key={uni._id} style={{ minWidth: '250px', padding: '1.5rem', textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>
                <div
                  className="uni-header-img"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, var(--primary-cyan), var(--primary-purple))`,
                    margin: '0 auto 1rem',
                    overflow: 'hidden'
                  }}
                  aria-hidden="true"
                >
                  <img
                    src={uni.images?.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-gradient" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{uni.name}</h3>
                <button
                  className="btn btn-secondary btn-block mt-1"
                  style={{ padding: '0.5rem', fontSize: '0.8rem', width: '100%' }}
                  onClick={() => onRemove(uni._id)}
                  aria-label={`Remove ${uni.name} from comparison`}
                >
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_METRICS_CONFIG.map(metric => (
            <tr key={metric.key}>
              <th scope="row" style={{ position: 'sticky', left: 0, background: 'var(--card-bg)', zIndex: 1, textAlign: 'left', padding: '1.5rem', borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
                {metric.label}
              </th>
              {universities.map(uni => (
                <td key={`${metric.key}-${uni._id}`} style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
                  {metric.formatter(uni)}
                </td>
              ))}
            </tr>
          ))}
          {/* Action Row */}
          <tr>
            <th scope="row" style={{ position: 'sticky', left: 0, background: 'var(--card-bg)', zIndex: 1, textAlign: 'left', padding: '1.5rem', borderTop: '1px solid var(--border-color)', fontWeight: 600 }}>
              Action
            </th>
            {universities.map(uni => (
              <td key={`action-${uni._id}`} style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
                <button className="btn btn-primary btn-block" style={{ width: '100%' }}>Apply</button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default CompareTable;
