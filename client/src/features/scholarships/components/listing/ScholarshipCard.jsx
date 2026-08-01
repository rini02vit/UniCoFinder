import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import DeadlineBadge from '../details/DeadlineBadge';

const ScholarshipCard = React.memo(({ scholarship }) => {
  const { id, title, provider, country, fundingType, deadlineInfo } = scholarship;

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <h3 className="card-title text-gradient" style={{ fontSize: '1.25rem', lineHeight: 1.4 }}>{title}</h3>
          <span className="badge badge-blue" style={{ flexShrink: 0 }}>{country}</span>
        </div>
        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>{provider}</p>
      </div>
      
      <div className="card-body" style={{ flex: 1 }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {fundingType}
        </p>
        
        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <DeadlineBadge deadlineInfo={deadlineInfo} />
        </div>
      </div>
      
      <div className="card-footer" style={{ marginTop: '1.5rem' }}>
        <Link 
          to={ROUTES.SCHOLARSHIP_DETAILS ? ROUTES.SCHOLARSHIP_DETAILS.replace(':id', id) : `/scholarships/${id}`} 
          className="btn btn-primary btn-block" 
          style={{ width: '100%', textAlign: 'center', display: 'block' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
});

export default ScholarshipCard;
