import React from 'react';
import ProfileField from './ProfileField';

const ProfileSection = ({ config, formData, isEditing, onChange, errors, isSaving }) => {
  return (
    <fieldset 
      className="card" 
      style={{ 
        padding: '2rem', 
        marginBottom: '2rem', 
        border: '1px solid var(--border-color)',
        borderRadius: '12px'
      }}
    >
      <legend style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-cyan)' }}>
        {config.title}
      </legend>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem 2rem'
      }}>
        {config.fields.map(field => (
          <ProfileField
            key={field.id}
            config={field}
            value={formData[field.id]}
            isEditing={isEditing}
            onChange={onChange}
            error={errors[field.id]}
            disabled={isSaving}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default React.memo(ProfileSection);
