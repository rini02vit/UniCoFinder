import React, { useState, useEffect } from 'react';

const AdminCountryForm = ({ initialData, onSave, onCancel, error }) => {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    continent: '',
    capital: '',
    language: '',
    currency: '',
    averageTuitionFee: '',
    averageLivingCost: '',
    visaFriendlinessScore: '',
    safetyIndex: '',
    visaRequirements: '',
    workPermit: false,
    postStudyWorkVisa: false,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        continent: initialData.continent || '',
        capital: initialData.capital || '',
        language: initialData.language || '',
        currency: initialData.currency || '',
        averageTuitionFee: initialData.averageTuitionFee || '',
        averageLivingCost: initialData.averageLivingCost || '',
        visaFriendlinessScore: initialData.visaFriendlinessScore || '',
        safetyIndex: initialData.safetyIndex || '',
        visaRequirements: initialData.visaRequirements || '',
        workPermit: initialData.workPermit || false,
        postStudyWorkVisa: initialData.postStudyWorkVisa || false,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numbers correctly
    const submitData = { ...formData };
    ['averageTuitionFee', 'averageLivingCost', 'visaFriendlinessScore', 'safetyIndex'].forEach(key => {
      if (submitData[key] !== '') {
        submitData[key] = Number(submitData[key]);
      } else {
        delete submitData[key];
      }
    });

    onSave(submitData);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        {isEditMode ? 'Edit Country' : 'Add New Country'}
      </h3>

      {error && (
        <div className="error-state" style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        
        {/* Basic Info */}
        <div className="form-group">
          <label>Country Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="form-control" 
            required 
            disabled={isEditMode} // Immutable on edit
            title={isEditMode ? "Country name cannot be changed after creation" : ""}
          />
        </div>
        <div className="form-group">
          <label>Country Code (e.g. US, UK)</label>
          <input type="text" name="code" value={formData.code} onChange={handleChange} className="form-control" />
        </div>
        
        <div className="form-group">
          <label>Continent</label>
          <input type="text" name="continent" value={formData.continent} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Capital City</label>
          <input type="text" name="capital" value={formData.capital} onChange={handleChange} className="form-control" />
        </div>

        <div className="form-group">
          <label>Language</label>
          <input type="text" name="language" value={formData.language} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Currency Code (e.g. USD)</label>
          <input type="text" name="currency" value={formData.currency} onChange={handleChange} className="form-control" />
        </div>

        {/* Financial & Scores (Recommendation Sensitive) */}
        <div className="form-group">
          <label>Average Tuition Fee ($)</label>
          <input type="number" name="averageTuitionFee" value={formData.averageTuitionFee} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Average Living Cost ($)</label>
          <input type="number" name="averageLivingCost" value={formData.averageLivingCost} onChange={handleChange} className="form-control" />
        </div>

        <div className="form-group">
          <label>Visa Friendliness (1-10)</label>
          <input type="number" name="visaFriendlinessScore" min="1" max="10" value={formData.visaFriendlinessScore} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Safety Index (1-100)</label>
          <input type="number" name="safetyIndex" min="1" max="100" value={formData.safetyIndex} onChange={handleChange} className="form-control" />
        </div>

        {/* Checkboxes & Textareas */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Visa Requirements Summary</label>
          <textarea name="visaRequirements" value={formData.visaRequirements} onChange={handleChange} className="form-control" rows="2" />
        </div>

        <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" name="workPermit" checked={formData.workPermit} onChange={handleChange} />
            Work Permit Allowed
          </label>
        </div>
        <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" name="postStudyWorkVisa" checked={formData.postStudyWorkVisa} onChange={handleChange} />
            Post-Study Work Visa
          </label>
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>General Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="4" />
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Save Changes' : 'Create Country'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCountryForm;
