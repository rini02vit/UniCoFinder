import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

const CountryCard = React.memo(({ country }) => {
  const { id, name, region, image, avgTuition, postStudyVisa } = country;
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <div className="card">
      <img
        src={imgSrc}
        alt={`Cover image for ${name}`}
        loading="lazy"
        decoding="async"
        className="uni-image" // Reusing the shared CSS class for consistent aspect ratio
        style={{
          width: '100%',
          height: '160px',
          objectFit: 'cover',
          borderRadius: '12px',
          marginBottom: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
        onError={() => setImgSrc('https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80')}
      />
      
      <div className="card-header" style={{ marginBottom: '0.5rem' }}>
        <h3 className="card-title">{name}</h3>
        <span className="text-secondary">{region}</span>
      </div>
      
      <div className="card-body">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">Tuition: {avgTuition}</span>
          <span className="badge badge-green">{postStudyVisa} PSW</span>
        </div>
      </div>
      
      <div className="card-footer" style={{ marginTop: '1rem' }}>
        <Link 
          to={ROUTES.COUNTRY_DETAILS ? ROUTES.COUNTRY_DETAILS.replace(':id', id) : `/countries/${id}`} 
          className="btn btn-secondary btn-block" 
          style={{ width: '100%', textAlign: 'center' }}
        >
          View Country Details
        </Link>
      </div>
    </div>
  );
});

export default CountryCard;
