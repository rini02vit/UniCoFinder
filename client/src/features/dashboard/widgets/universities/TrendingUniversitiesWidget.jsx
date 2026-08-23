import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { universitiesApi } from '../../../universities/services/universitiesApi';
import UniversityCard from '../../../universities/components/listing/UniversityCard';

const TrendingUniversitiesWidget = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await universitiesApi.getTrending();
        setTrending(res.data?.universities || []);
      } catch (err) {
        console.error('Failed to load trending universities', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <div className="card">Loading Trending...</div>;
  if (!trending.length) return null;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🔥 Trending Universities</h3>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {trending.map((uni, idx) => (
            <div key={uni._id || idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{uni.name}</div>
              <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{uni.city}, {uni.country}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="badge badge-purple" style={{ marginRight: '0.5rem' }}>#{uni.ranking || 'N/A'}</span>
              </div>
              <Link to={`/university/${uni._id}`} className="btn btn-outline" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', padding: '0.5rem' }}>View</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingUniversitiesWidget;
