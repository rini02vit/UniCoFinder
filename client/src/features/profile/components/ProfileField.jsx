import React from 'react';
import ProfileValue from './ProfileValue';
import EditableField from './EditableField';

const ProfileField = ({ config, value, isEditing, onChange, error, disabled }) => {
  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <label 
        htmlFor={`profile-${config.id}`} 
        className="form-label" 
        style={{ color: error ? 'var(--danger)' : 'var(--text-secondary)' }}
      >
        {config.label} {config.required && isEditing && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>

      {isEditing ? (
        <EditableField
          config={config}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      ) : (
        <ProfileValue value={value} />
      )}

      {error && (
        <p id={`error-${config.id}`} style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
      
      {!error && config.helperText && isEditing && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {config.helperText}
        </p>
      )}
    </div>
  );
};

export default React.memo(ProfileField);
