import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import AdminUniversityForm from '../components/AdminUniversityForm';
import { Loader2, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';

const ManageUniversities = () => {
  const [universities, setUniversities] = useState([]);
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
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUniversities({ page, limit: 10, search: activeSearch });
      setUniversities(response.data);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCreate = () => {
    setSelectedUniversity(null);
    setFormError(null);
    setView('create');
  };

  const handleEdit = (university) => {
    setSelectedUniversity(university);
    setFormError(null);
    setView('edit');
  };

  const handleDelete = async (university) => {
    if (window.confirm(`Are you sure you want to delete ${university.name}? This action cannot be undone.`)) {
      try {
        await adminApi.deleteUniversity(university._id);
        fetchUniversities(); // Refresh list
      } catch (err) {
        if (err.response?.status === 409) {
          alert(`Cannot delete ${university.name}: ${err.response.data.message}`);
        } else {
          alert(err.response?.data?.message || 'Failed to delete university');
        }
      }
    }
  };

  const handleSave = async (formData) => {
    setFormError(null);
    try {
      if (view === 'create') {
        await adminApi.createUniversity(formData);
      } else {
        await adminApi.updateUniversity(selectedUniversity._id, formData);
      }
      setView('list');
      fetchUniversities();
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred while saving.');
    }
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>{view === 'create' ? 'Add University' : 'Edit University'}</h1>
        </div>
        <AdminUniversityForm 
          initialData={selectedUniversity} 
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
          <h1>Manage Universities</h1>
          <p className="text-muted">Create, update, and remove universities from the platform.</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Plus size={18} /> Add University
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name, country, city..." 
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
        ) : universities.length === 0 ? (
          <div className="empty-state">
            <p>No universities found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Country</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Ranking</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Tuition / yr</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map(university => (
                    <tr key={university._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{university.name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{university.country || '-'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{university.ranking ? `#${university.ranking}` : '-'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {university.tuitionFee ? `$${university.tuitionFee.toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(university)} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(university)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} title="Delete">
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

export default ManageUniversities;
