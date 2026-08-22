import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import AdminScholarshipForm from '../components/AdminScholarshipForm';
import { Loader2, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';

const ManageScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const debouncedSearch = useDebounce(search, 300);
  const [activeSearch, setActiveSearch] = useState('');

  useEffect(() => {
    if (debouncedSearch !== activeSearch) {
      setPage(1);
      setActiveSearch(debouncedSearch);
    }
  }, [debouncedSearch, activeSearch]);
  
  // View State
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchScholarships = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getScholarships({ page, limit: 10, search: activeSearch });
      setScholarships(response.data);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCreate = () => {
    setSelectedScholarship(null);
    setFormError(null);
    setView('create');
  };

  const handleEdit = (scholarship) => {
    setSelectedScholarship(scholarship);
    setFormError(null);
    setView('edit');
  };

  const handleDelete = async (scholarship) => {
    if (window.confirm(`Are you sure you want to delete ${scholarship.name}? This action cannot be undone.`)) {
      try {
        await adminApi.deleteScholarship(scholarship._id);
        fetchScholarships(); // Refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete scholarship');
      }
    }
  };

  const handleSave = async (formData) => {
    setFormError(null);
    try {
      if (view === 'create') {
        await adminApi.createScholarship(formData);
      } else {
        await adminApi.updateScholarship(selectedScholarship._id, formData);
      }
      setView('list');
      fetchScholarships();
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred while saving.');
    }
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>{view === 'create' ? 'Add Scholarship' : 'Edit Scholarship'}</h1>
        </div>
        <AdminScholarshipForm 
          initialData={selectedScholarship} 
          onSave={handleSave} 
          onCancel={() => setView('list')}
          error={formError}
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Manage Scholarships</h1>
          <p className="text-muted">Create, update, and remove scholarships from the platform.</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Plus size={18} /> Add Scholarship
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name, provider..." 
              value={search} 
              onChange={handleSearchChange} 
              className="form-control"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {error ? (
          <div className="error-state">{error}</div>
        ) : loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="spinner" size={32} />
          </div>
        ) : scholarships.length === 0 ? (
          <div className="empty-state">
            <p>No scholarships found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Provider</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Target</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Deadline</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map(scholarship => (
                    <tr key={scholarship._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{scholarship.name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{scholarship.provider || '-'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {scholarship.university ? scholarship.university.name : (scholarship.country || 'Global')}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {scholarship.applicationDeadline ? new Date(scholarship.applicationDeadline).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(scholarship)} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(scholarship)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
              btnClass="btn btn-secondary" 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageScholarships;
