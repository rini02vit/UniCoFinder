import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Users, Building2, GraduationCap, Globe, FileText, Star, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="stat-card">
    <div className={`stat-icon ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
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

  // Account for empty dataset valid resolution
  if (!data || Object.keys(data.counts).length === 0) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <p>No dashboard data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Overview of platform metrics and recent activity.</p>
      </div>
      
      <div className="dashboard-content" style={{ marginTop: '2rem' }}>
        {/* Global Counts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <StatCard title="Total Users" value={data.counts.users} icon={Users} colorClass="text-primary" />
          <StatCard title="Universities" value={data.counts.universities} icon={Building2} colorClass="text-secondary" />
          <StatCard title="Scholarships" value={data.counts.scholarships} icon={GraduationCap} colorClass="text-accent" />
          <StatCard title="Countries" value={data.counts.countries} icon={Globe} colorClass="text-success" />
          <StatCard title="Applications" value={data.counts.applications} icon={FileText} colorClass="text-warning" />
          <StatCard title="Reviews" value={data.counts.reviews} icon={Star} colorClass="text-danger" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {/* Recent Registrations */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Recent Registrations</h3>
            {data.recentActivity.users.length === 0 ? (
              <p className="text-muted">No users found.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.recentActivity.users.map(user => (
                  <li key={user._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <strong>{user.name}</strong>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>{user.email}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.875rem' }}>
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>{user.role}</span>
                      <span className="text-muted" style={{ marginTop: '4px' }}>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Applications */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Recent Applications</h3>
            {data.recentActivity.applications.length === 0 ? (
              <p className="text-muted">No applications found.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.recentActivity.applications.map(app => (
                  <li key={app._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <strong>{app.university?.name || 'Unknown University'}</strong>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>{app.course}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.875rem' }}>
                      <span className="badge badge-accent">{app.status}</span>
                      <span className="text-muted" style={{ marginTop: '4px' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
