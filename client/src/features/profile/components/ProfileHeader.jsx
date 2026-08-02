import React from 'react';

const ProfileHeader = ({ profileData, isEditing, isDirty, onEdit, onSave, onCancel, isSaving }) => {
  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--gradient-btn)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'white'
          }}
        >
          {profileData?.firstName?.charAt(0) || 'U'}
        </div>
        
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            {profileData?.firstName} {profileData?.lastName}
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {profileData?.email}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {isEditing ? (
          <>
            <button 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onSave}
              disabled={isSaving || !isDirty}
              aria-busy={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={onEdit}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(ProfileHeader);
