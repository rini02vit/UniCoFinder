import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useScholarshipDetails } from '../hooks/useScholarshipDetails';
import { ELIGIBILITY_METRICS_CONFIG } from '../constants/scholarshipsConfig';
import MetricsGrid from '../../countries/components/details/MetricsGrid'; // Reuse from countries module
import { DetailsSkeleton } from '../../universities/components/details/DetailsSections'; // Reuse skeleton
import DeadlineBadge from '../components/details/DeadlineBadge';
import OfficialWebsiteButton from '../components/details/OfficialWebsiteButton';

// Reusing the exact visual pattern established in CountryDetailsPage
const DetailsHero = ({ title, provider, fundingType }) => (
  <div 
    className="uni-hero"
    style={{
      height: '220px',
      background: `linear-gradient(135deg, rgba(30, 58, 138, 1), rgba(15, 23, 42, 1))`,
      borderRadius: '16px',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '2rem',
      border: '1px solid var(--border-color)'
    }}
  >
    <div>
      <span className="badge badge-purple" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        {fundingType}
      </span>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
        Offered by: {provider}
      </p>
    </div>
  </div>
);

const ScholarshipDetailsPage = () => {
  const { id } = useParams();
  const { data, status, error, retry } = useScholarshipDetails(id);

  if (status === 'loading') {
    return <DetailsSkeleton />;
  }

  if (status === 'error') {
    return (
      <div className="state-container" style={{ marginTop: '2rem' }}>
        <div className="state-icon error" aria-hidden="true">⚠️</div>
        <h3 className="state-title">Failed to load scholarship details</h3>
        <p className="state-desc">{error?.message || 'We could not fetch the details for this scholarship.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={retry}>Retry</button>
          <Link to={ROUTES.SCHOLARSHIPS || '/scholarships'} className="btn btn-outline">Back to Scholarships</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <Link 
        to={ROUTES.SCHOLARSHIPS || '/scholarships'} 
        style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          display: 'inline-block',
          fontWeight: 500
        }}
        aria-label="Back to Scholarships"
      >
        &larr; Back to Scholarships
      </Link>

      <DetailsHero 
        title={data.title} 
        provider={data.provider}
        fundingType={data.fundingType} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column (Main Content) */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Overview</h2>
            <p className="text-secondary" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
              {data.description}
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <MetricsGrid title="Eligibility Criteria" data={data.eligibility} config={ELIGIBILITY_METRICS_CONFIG} />
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Benefits</h2>
            <div className="card" style={{ padding: '2rem' }}>
              <p style={{ lineHeight: 1.6 }}>{data.benefits}</p>
            </div>
          </section>
        </div>

        {/* Right Column (Actions / Meta) */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="card" style={{ position: 'sticky', top: '2rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Application Deadline</h3>
            
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <DeadlineBadge deadlineInfo={data.deadlineInfo} />
            </div>

            <OfficialWebsiteButton url={data.officialWebsite} />
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button className="btn btn-outline" style={{ width: '100%' }}>
                Save to Wishlist
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScholarshipDetailsPage;
