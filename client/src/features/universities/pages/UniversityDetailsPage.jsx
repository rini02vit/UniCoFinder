import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUniversityDetails } from '../hooks/useUniversityDetails';
import { useWishlistMutation } from '../hooks/useWishlistMutation';
import { useApplicationMutation } from '../hooks/useApplicationMutation';
import { KEY_STATISTICS_CONFIG } from '../constants/universitiesConfig';
import { 
  UniversityHero, 
  StatisticsSection, 
  AdmissionsSection,
  DetailsSkeleton
} from '../components/details/DetailsSections';

const UniversityDetailsPage = () => {
  const { id } = useParams();
  const { data, status, error } = useUniversityDetails(id);
  
  // Use mutations (conditionally utilizing the fetched data's initial state if available)
  const { isWishlisted, isSaving, toggleWishlist } = useWishlistMutation(data?.isWishlisted);
  const { hasApplied, isApplying, apply } = useApplicationMutation(data?.hasApplied);

  if (status === 'loading') {
    return <DetailsSkeleton />;
  }

  if (status === 'error') {
    return (
      <div className="state-container" style={{ marginTop: '2rem' }}>
        <div className="state-icon error">⚠️</div>
        <h3 className="state-title">University Not Found</h3>
        <p className="state-desc">{error?.message || "We couldn't find the details for this university."}</p>
        <Link to="/universities" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          Back to Search
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <Link 
        to="/universities" 
        style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '1rem',
          display: 'inline-block'
        }}
      >
        &larr; Back to Results
      </Link>

      <UniversityHero 
        title={data.name} 
        location={data.location} 
        image={data.image} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left Column (Will span 2 columns on desktop via CSS, but using auto-fit for basic responsive) */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Overview</h3>
          <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
            {data.description}
          </p>

          <StatisticsSection stats={data.stats} config={KEY_STATISTICS_CONFIG} />
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <AdmissionsSection predictor={data.predictor} />

          {/* Actions */}
          <div className="card">
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '0.5rem' }}
              onClick={() => apply(data.id)}
              disabled={hasApplied || isApplying}
            >
              {hasApplied ? 'Application Submitted' : isApplying ? 'Starting...' : 'Start Application'}
            </button>
            <button 
              className="btn btn-outline" 
              style={{ width: '100%', marginBottom: '0.5rem' }}
              onClick={() => toggleWishlist(data.id)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              Add to Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailsPage;
