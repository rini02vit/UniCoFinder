import React, { useState, useCallback } from 'react';
import { useTracker } from '../hooks/useTracker';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationCardSkeleton from '../components/ApplicationCardSkeleton';
import { EmptyState } from '../../dashboard/components/primitives/DataDisplays';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { GraduationCap } from 'lucide-react';

const TrackerPage = () => {
  const { applications, isLoading, error, retry } = useTracker();
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const handleToggle = useCallback((id) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Application Tracker</h1>
        {!isLoading && applications.length > 0 && (
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            {applications.length} Application{applications.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error && !applications.length && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 500 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => retry()}>
            Retry Loading
          </button>
        </div>
      )}

      {isLoading ? (
        <>
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
          <ApplicationCardSkeleton />
        </>
      ) : !error && applications.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={48} />}
          title="No Applications Found"
          description="You haven't started tracking any university applications yet. Start by exploring universities and adding them to your tracker."
          actionText="Find Universities"
          onAction={() => navigate(ROUTES.UNIVERSITIES)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {applications.map(app => (
            <ApplicationCard 
              key={app.id} 
              application={app} 
              expanded={expandedId === app.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackerPage;
