import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Loader2 } from 'lucide-react';

const CSSBarChart = ({ data, title, height = 200 }) => {
  if (!data || data.length === 0) return <p className="text-muted">No data available for {title}</p>;
  
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: `${height}px`, gap: '8px', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {data.map((item, index) => {
          const barHeight = (item.count / maxCount) * 100;
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '30px' }}>
              <div 
                style={{ 
                  height: `${barHeight}%`, 
                  width: '100%', 
                  backgroundColor: 'var(--primary)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }} 
                title={`${item._id}: ${item.count}`}
              ></div>
              <div style={{ fontSize: '10px', marginTop: '4px', transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                {item._id.substring(5)} {/* show MM-DD */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CSSProgressBar = ({ label, value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: '4px' }}></div>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getAnalytics(range);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  if (loading && !data) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="spinner" size={40} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  const hasData = data && (data.registrationsOverTime.length > 0 || data.applicationsOverTime.length > 0 || data.popularUniversities.length > 0);

  if (!hasData && !loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <p>No analytics data available for the selected range.</p>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="form-control" style={{ maxWidth: '200px', marginTop: '1rem', margin: '1rem auto' }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Platform Analytics</h1>
          <p className="text-muted">Time-series data and popularity metrics.</p>
        </div>
        <div>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="form-control" style={{ minWidth: '150px' }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>
      
      <div className="analytics-content" style={{ marginTop: '2rem', opacity: loading ? 0.5 : 1 }}>
        <CSSBarChart data={data.registrationsOverTime} title="User Registrations (Time Series)" />
        <CSSBarChart data={data.applicationsOverTime} title="Applications Submitted (Time Series)" />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Most Applied-To Universities</h3>
            {data.popularUniversities.length === 0 ? (
              <p className="text-muted">No application data.</p>
            ) : (
              <div>
                {data.popularUniversities.map((uni, idx) => (
                  <CSSProgressBar key={uni._id} label={`${idx + 1}. ${uni.name}`} value={uni.count} max={data.popularUniversities[0]?.count || 1} />
                ))}
              </div>
            )}
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Most Wishlisted Universities</h3>
            {data.wishlistedUniversities.length === 0 ? (
              <p className="text-muted">No wishlist data.</p>
            ) : (
              <div>
                {data.wishlistedUniversities.map((uni, idx) => (
                  <CSSProgressBar key={uni._id} label={`${idx + 1}. ${uni.name}`} value={uni.count} max={data.wishlistedUniversities[0]?.count || 1} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Application Statuses (Current)</h3>
            {!data.applicationStatuses || data.applicationStatuses.length === 0 ? (
              <p className="text-muted">No status data.</p>
            ) : (
              <div>
                {data.applicationStatuses.map((status, idx) => (
                  <CSSProgressBar key={status._id || idx} label={status._id || 'Planning'} value={status.count} max={Math.max(...data.applicationStatuses.map(s => s.count))} />
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Scholarships by Coverage</h3>
            {!data.scholarshipsByCoverage || data.scholarshipsByCoverage.length === 0 ? (
              <p className="text-muted">No scholarship coverage data.</p>
            ) : (
              <div>
                {data.scholarshipsByCoverage.map((item, idx) => (
                  <CSSProgressBar key={item._id || idx} label={item._id || 'Unknown'} value={item.count} max={Math.max(...data.scholarshipsByCoverage.map(s => s.count))} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
