import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { Loader2 } from 'lucide-react';

const AdminUniversityForm = ({ initialData, onSave, onCancel, error }) => {
  const isEditMode = !!initialData;
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    degreeLevels: '',
    courses: '',
    tuitionFee: '',
    currency: 'USD',
    ranking: '',
    cgpaRequirement: '',
    acceptanceRate: '',
    livingCost: '',
    englishExamRequirements: '',
    intakeMonths: '',
    applicationDeadline: '',
    website: '',
    gallery: '',
    description: ''
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await adminApi.getCountries({ limit: 200 }); // fetch enough to cover all
        setCountries(res.data);
      } catch (err) {
        console.error('Failed to load countries', err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        country: initialData.country || '',
        city: initialData.city || '',
        degreeLevels: initialData.degreeLevels ? initialData.degreeLevels.join(', ') : '',
        courses: initialData.courses ? initialData.courses.join(', ') : '',
        tuitionFee: initialData.tuitionFee || '',
        currency: initialData.currency || 'USD',
        ranking: initialData.ranking || '',
        cgpaRequirement: initialData.cgpaRequirement || '',
        acceptanceRate: initialData.acceptanceRate || '',
        livingCost: initialData.livingCost || '',
        englishExamRequirements: initialData.englishExamRequirements ? initialData.englishExamRequirements.join(', ') : '',
        intakeMonths: initialData.intakeMonths ? initialData.intakeMonths.join(', ') : '',
        applicationDeadline: initialData.applicationDeadline ? initialData.applicationDeadline.split('T')[0] : '',
        website: initialData.website || '',
        gallery: initialData.gallery ? initialData.gallery.join(', ') : '',
        description: initialData.description || ''
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
    ['degreeLevels', 'courses', 'englishExamRequirements', 'intakeMonths', 'gallery'].forEach(key => {
      if (submitData[key]) {
        submitData[key] = submitData[key].split(',').map(s => s.trim()).filter(s => s);
      } else {
        submitData[key] = [];
      }
    });

    // Parse numbers
    ['tuitionFee', 'ranking', 'cgpaRequirement', 'acceptanceRate', 'livingCost'].forEach(key => {
      if (submitData[key] !== '') {
        submitData[key] = Number(submitData[key]);
      } else {
        delete submitData[key];
      }
    });

    // Date
    if (!submitData.applicationDeadline) {
      delete submitData.applicationDeadline;
    }

    onSave(submitData);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        {isEditMode ? 'Edit University' : 'Add New University'}
      </h3>

      {error && (
        <div className="error-state" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {loadingCountries ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader2 className="spinner" size={24} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div className="form-group">
            <label>University Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
          </div>

          <div className="form-group">
            <label>Country *</label>
            <select name="country" value={formData.country} onChange={handleChange} className="form-control" required>
              <option value="">Select a Country</option>
              {countries.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Ranking</label>
            <input type="number" name="ranking" value={formData.ranking} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Tuition Fee / yr</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="form-control" style={{ width: '80px' }} />
              <input type="number" name="tuitionFee" value={formData.tuitionFee} onChange={handleChange} className="form-control" />
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group">
            <label>CGPA Requirement</label>
            <input type="number" step="0.1" name="cgpaRequirement" value={formData.cgpaRequirement} onChange={handleChange} className="form-control" />
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group">
            <label>Living Cost / yr</label>
            <input type="number" name="livingCost" value={formData.livingCost} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Acceptance Rate (%)</label>
            <input type="number" step="0.1" name="acceptanceRate" value={formData.acceptanceRate} onChange={handleChange} className="form-control" />
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
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Courses (comma separated)</label>
            <textarea name="courses" value={formData.courses} onChange={handleChange} className="form-control" rows="2" placeholder="e.g. Computer Science, Business, Engineering" />
            <small style={{ color: 'var(--text-muted)' }}>Important for recommendations</small>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>English Exam Requirements (comma separated)</label>
            <input type="text" name="englishExamRequirements" value={formData.englishExamRequirements} onChange={handleChange} className="form-control" placeholder="e.g. IELTS 6.5, TOEFL 90" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Intake Months (comma separated)</label>
            <input type="text" name="intakeMonths" value={formData.intakeMonths} onChange={handleChange} className="form-control" placeholder="e.g. September, January" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Gallery URLs (comma separated)</label>
            <textarea name="gallery" value={formData.gallery} onChange={handleChange} className="form-control" rows="2" placeholder="https://image1.jpg, https://image2.jpg" />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4" />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Save Changes' : 'Create University'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminUniversityForm;
