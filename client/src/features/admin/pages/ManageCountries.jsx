import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import AdminCountryForm from '../components/AdminCountryForm';
import { Loader2, Plus, Edit2, Trash2, Search } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';

const ManageCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // View State
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCountries({ page, limit: 10, search });
      setCountries(response.data);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  const handleCreate = () => {
    setSelectedCountry(null);
    setFormError(null);
    setView('create');
  };

  const handleEdit = (country) => {
    setSelectedCountry(country);
    setFormError(null);
    setView('edit');
  };

  const handleDelete = async (country) => {
    if (window.confirm(`Are you sure you want to delete ${country.name}? This action cannot be undone.`)) {
      try {
        await adminApi.deleteCountry(country._id);
        fetchCountries(); // Refresh list
      } catch (err) {
        if (err.response?.status === 409) {
          alert(`Cannot delete ${country.name}: ${err.response.data.message}`);
        } else {
          alert(err.response?.data?.message || 'Failed to delete country');
        }
      }
    }
  };

  const handleSave = async (formData) => {
    setFormError(null);
    try {
      if (view === 'create') {
        await adminApi.createCountry(formData);
      } else {
        await adminApi.updateCountry(selectedCountry._id, formData);
      }
      setView('list');
      fetchCountries();
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred while saving.');
    }
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>{view === 'create' ? 'Add Country' : 'Edit Country'}</h1>
        </div>
        <AdminCountryForm 
          initialData={selectedCountry} 
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
          <h1>Manage Countries</h1>
          <p className="text-muted">Create, update, and remove countries from the platform.</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Plus size={18} /> Add Country
        </button>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name, code..." 
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
        ) : countries.length === 0 ? (
          <div className="empty-state">
            <p>No countries found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Code</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Continent</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Tuition / yr</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map(country => (
                    <tr key={country._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{country.name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{country.code || '-'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{country.continent || '-'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {country.averageTuitionFee ? `$${country.averageTuitionFee.toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(country)} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(country)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} title="Delete">
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

export default ManageCountries;
