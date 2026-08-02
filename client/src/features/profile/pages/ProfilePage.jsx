import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { PROFILE_SECTIONS } from '../constants/profileConfig';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSection from '../components/ProfileSection';

const ProfilePage = () => {
  const { state, actions } = useProfile();

  if (state.isLoading) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <h1 className="page-title mb-4">My Profile</h1>
        <div className="card skeleton-bg" style={{ height: '140px', marginBottom: '2rem' }}></div>
        <div className="card skeleton-bg" style={{ height: '300px', marginBottom: '2rem' }}></div>
        <div className="card skeleton-bg" style={{ height: '300px' }}></div>
      </div>
    );
  }

  if (state.fetchError && !state.profileData) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <h1 className="page-title mb-4">My Profile</h1>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.fetchError}</p>
          <button className="btn btn-primary" onClick={actions.fetchProfile}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="page-title mb-4">My Profile</h1>
      
      {/* Accessibility live region for success messages */}
      <div aria-live="polite" className="sr-only">
        {state.saveSuccess ? 'Profile saved successfully.' : ''}
      </div>

      <ProfileHeader 
        profileData={state.profileData}
        isEditing={state.isEditing}
        isDirty={state.isDirty}
        isSaving={state.isSaving}
        onEdit={actions.handleEditToggle}
        onSave={actions.handleSave}
        onCancel={actions.handleCancel}
      />

      {state.saveError && (
        <div className="card" style={{ padding: '1rem', marginBottom: '2rem', border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
          <p style={{ color: 'var(--danger)', margin: 0, fontWeight: 500 }}>{state.saveError}</p>
        </div>
      )}

      {state.saveSuccess && (
        <div className="card" style={{ padding: '1rem', marginBottom: '2rem', border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
          <p style={{ color: 'var(--success)', margin: 0, fontWeight: 500 }}>Profile saved successfully!</p>
        </div>
      )}

      <form 
        onSubmit={(e) => { e.preventDefault(); actions.handleSave(); }}
        aria-busy={state.isSaving}
      >
        {PROFILE_SECTIONS.map(sectionConfig => (
          <ProfileSection 
            key={sectionConfig.id}
            config={sectionConfig}
            formData={state.isEditing ? state.formData : state.profileData}
            isEditing={state.isEditing}
            isSaving={state.isSaving}
            errors={state.errors}
            onChange={actions.handleChange}
          />
        ))}
      </form>
    </div>
  );
};

export default ProfilePage;
