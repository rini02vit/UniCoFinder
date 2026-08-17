import React from 'react';
import { Link } from 'react-router-dom';

const UniversityCard = React.memo(({ 
  university, 
  onSave, 
  isSaving = false 
}) => {
  const {
    id,
    name,
    location,
    image,
    ranking,
    matchStatus,
    tuition,
    acceptanceRate,
    explanation
  } = university;

  return (
    <div className="card">
      <div 
        className="uni-image" 
        style={{ 
          background: `url(${image}) center/cover`,
          height: '160px',
          width: '100%',
          borderRadius: '12px',
          marginBottom: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
      ></div>
      <div className="card-header" style={{ marginBottom: '0.5rem' }}>
        <h3 className="card-title">{name}</h3>
        <span className="text-secondary">{location}</span>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {ranking && (
            <span className="badge badge-purple">#{ranking} World</span>
          )}
          {matchStatus && (
            <span className={`badge ${matchStatus.includes('Safe') ? 'badge-green' : 'badge-orange'}`}>
              {matchStatus}
            </span>
          )}
        </div>
        {explanation && (
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            {explanation}
          </p>
        )}
        <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          Tuition: {tuition ? `$${tuition.toLocaleString()}/yr` : 'N/A'}
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Acceptance: {acceptanceRate ? `${acceptanceRate}%` : 'N/A'}
        </p>
      </div>
      <div className="card-footer" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          className="btn btn-outline" 
          style={{ padding: '0.5rem 1rem' }}
          onClick={() => onSave(id)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <Link to={`/universities/${id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
          View Details
        </Link>
      </div>
    </div>
  );
});

export default UniversityCard;
