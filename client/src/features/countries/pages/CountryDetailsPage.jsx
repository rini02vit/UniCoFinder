import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useCountryDetails } from '../hooks/useCountryDetails';
import { 
  COST_METRICS_CONFIG, 
  VISA_METRICS_CONFIG, 
  EMPLOYMENT_METRICS_CONFIG,
  DETAILS_SECTIONS_ORDER 
} from '../constants/countriesConfig';
import MetricsGrid from '../components/details/MetricsGrid';
import { DetailsSkeleton } from '../../universities/components/details/DetailsSections'; // Reuse skeleton
import UniversityCard from '../../universities/components/listing/UniversityCard'; // Reuse UniversityCard directly!

const DetailsHero = ({ name, region, image }) => (
  <div 
    className="uni-hero"
    style={{
      height: '250px',
      background: `linear-gradient(rgba(5, 8, 22, 0.5), rgba(5, 8, 22, 1)), url(${image}) center/cover`,
      borderRadius: '16px',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '2rem',
      border: '1px solid var(--border-color)'
    }}
  >
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{name}</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
        {region}
      </p>
    </div>
  </div>
);

const CountryDetailsPage = () => {
  const { id } = useParams();
  const { data, status, error, retry } = useCountryDetails(id);

  // We only run this mapping if we actually need it, though mappers handle most logic
  const renderSection = useMemo(() => {
    if (!data) return () => null;

    const sections = {
      overview: (
        <section key="overview" style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Overview</h2>
          <p className="text-secondary" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
            {data.overview}
          </p>
        </section>
      ),
      cost: (
        <section key="cost" style={{ marginBottom: '1rem' }}>
          <MetricsGrid title="Cost Overview" data={data.costs} config={COST_METRICS_CONFIG} />
        </section>
      ),
      visa: (
        <section key="visa" style={{ marginBottom: '1rem' }}>
          <MetricsGrid title="Visa Information" data={data.visa} config={VISA_METRICS_CONFIG} />
        </section>
      ),
      employment: (
        <section key="employment" style={{ marginBottom: '1rem' }}>
          <MetricsGrid title="Employment Information" data={data.employment} config={EMPLOYMENT_METRICS_CONFIG} />
        </section>
      ),
      universities: (
        <section key="universities" style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Top Universities in {data.name}</h2>
          {data.topUniversities && data.topUniversities.length > 0 ? (
            <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {data.topUniversities.map(uni => (
                <UniversityCard 
                  key={uni.id} 
                  university={uni} 
                  // In a real app we'd pass onSave hooks here if we want them actionable from this view
                  onSave={() => console.log('Save from country view', uni.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="state-container card" style={{ padding: '3rem' }}>
              <div className="state-icon" style={{ opacity: 0.5 }} aria-hidden="true">🏫</div>
              <h3 className="state-title">No universities listed</h3>
              <p className="state-desc">No university data is currently linked to this country.</p>
            </div>
          )}
        </section>
      )
    };

    return (sectionKey) => sections[sectionKey] || null;
  }, [data]);

  if (status === 'loading') {
    return <DetailsSkeleton />;
  }

  if (status === 'error') {
    return (
      <div className="state-container" style={{ marginTop: '2rem' }}>
        <div className="state-icon error" aria-hidden="true">⚠️</div>
        <h3 className="state-title">Failed to load country details</h3>
        <p className="state-desc">{error?.message || 'We could not fetch the details for this country.'}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={retry}>Retry</button>
          <Link to={ROUTES.COUNTRIES || '/countries'} className="btn btn-outline">Back to Countries</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <Link 
        to={ROUTES.COUNTRIES || '/countries'} 
        style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          display: 'inline-block',
          fontWeight: 500
        }}
        aria-label="Back to Countries"
      >
        &larr; Back to Countries
      </Link>

      <DetailsHero 
        name={data.name} 
        region={data.region} 
        image={data.image} 
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {DETAILS_SECTIONS_ORDER.map(sectionKey => renderSection(sectionKey))}
      </div>
    </div>
  );
};

export default CountryDetailsPage;
