import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Loader2 } from 'lucide-react';

const AdminScholarshipForm = ({ initialData, onSave, onCancel, error }) => {
  const isEditMode = !!initialData;
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    country: '',
    university: '',
    description: '',
    minimumCgpa: '',
    degreeLevels: '',
    courses: '',
    eligibleCountries: '',
    englishExamRequirements: '',
    amount: '',
    currency: 'USD',
    coverageType: 'Partial',
    applicationDeadline: '',
    website: ''
  });

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [countriesRes, unisRes] = await Promise.all([
          adminApi.getCountries({ limit: 200 }),
          adminApi.getUniversities({ limit: 1000 })
        ]);
        setCountries(countriesRes.data);
        setUniversities(unisRes.data);
      } catch (err) {
        console.error('Failed to load lookup data', err);
      } finally {
        setLoadingLookups(false);
      }
    };
    fetchLookups();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        provider: initialData.provider || '',
        country: initialData.country || '',
        university: initialData.university ? (typeof initialData.university === 'object' ? initialData.university._id : initialData.university) : '',
        description: initialData.description || '',
        minimumCgpa: initialData.minimumCgpa || '',
        degreeLevels: initialData.degreeLevels ? initialData.degreeLevels.join(', ') : '',
        courses: initialData.courses ? initialData.courses.join(', ') : '',
        eligibleCountries: initialData.eligibleCountries ? initialData.eligibleCountries.join(', ') : '',
        englishExamRequirements: initialData.englishExamRequirements ? initialData.englishExamRequirements.join(', ') : '',
        amount: initialData.amount || '',
        currency: initialData.currency || 'USD',
        coverageType: initialData.coverageType || 'Partial',
        applicationDeadline: initialData.applicationDeadline ? initialData.applicationDeadline.split('T')[0] : '',
        website: initialData.website || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = { ...formData };
    
    // Parse comma separated arrays
    ['degreeLevels', 'courses', 'eligibleCountries', 'englishExamRequirements'].forEach(key => {
      if (submitData[key]) {
        submitData[key] = submitData[key].split(',').map(s => s.trim()).filter(s => s);
      } else {
        submitData[key] = [];
      }
    });

    // Parse numbers
    ['minimumCgpa', 'amount'].forEach(key => {
      if (submitData[key] !== '') {
        submitData[key] = Number(submitData[key]);
      } else {
        delete submitData[key];
      }
    });

    // Nullify empty relations
    if (!submitData.country) delete submitData.country;
    if (!submitData.university) delete submitData.university;
    if (!submitData.applicationDeadline) delete submitData.applicationDeadline;

    onSave(submitData);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        {isEditMode ? 'Edit Scholarship' : 'Add New Scholarship'}
      </h3>

      {error && (
        <div className="error-state" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {loadingLookups ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader2 className="spinner" size={24} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Scholarship Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>

          <div className="form-group">
            <label>Provider</label>
            <input type="text" name="provider" value={formData.provider} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Coverage Type *</label>
            <select name="coverageType" value={formData.coverageType} onChange={handleChange} className="form-control" required>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
              <option value="Tuition">Tuition</option>
              <option value="Living">Living</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="form-control" style={{ width: '80px' }} />
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label>Minimum CGPA</label>
            <input type="number" step="0.1" name="minimumCgpa" value={formData.minimumCgpa} onChange={handleChange} className="form-control" />
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group">
            <label>Target Country</label>
            <select name="country" value={formData.country} onChange={handleChange} className="form-control">
              <option value="">Any / Not Specific</option>
              {countries.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group">
            <label>Target University</label>
            <select name="university" value={formData.university} onChange={handleChange} className="form-control">
              <option value="">Any / Not Specific</option>
              {universities.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Degree Levels (comma separated)</label>
            <input type="text" name="degreeLevels" value={formData.degreeLevels} onChange={handleChange} className="form-control" placeholder="e.g. Bachelors, Masters, PhD" />
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Courses (comma separated)</label>
            <textarea name="courses" value={formData.courses} onChange={handleChange} className="form-control" rows="2" placeholder="e.g. Computer Science, Business, Engineering" />
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Eligible Nationalities (comma separated)</label>
            <input type="text" name="eligibleCountries" value={formData.eligibleCountries} onChange={handleChange} className="form-control" placeholder="e.g. India, USA, Global" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>English Exam Requirements (comma separated)</label>
            <input type="text" name="englishExamRequirements" value={formData.englishExamRequirements} onChange={handleChange} className="form-control" placeholder="e.g. IELTS 6.5, TOEFL 90" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4" />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Save Changes' : 'Create Scholarship'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminScholarshipForm;
