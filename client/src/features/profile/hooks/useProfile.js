import { useState, useCallback, useEffect } from 'react';
import { profileApi } from '../services/profileApi';
import { normalizeProfileData } from '../utils/profileMappers';
import { validateProfileForm } from '../utils/validation';

export const useProfile = () => {
  // Source of truth (backend matched)
  const [profileData, setProfileData] = useState(null);
  
  // Working copy for the edit form
  const [formData, setFormData] = useState({});
  
  // Status flags
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Flow states
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const rawData = await profileApi.getProfile();
      const normalized = normalizeProfileData(rawData);
      setProfileData(normalized);
      setFormData(normalized);
    } catch (err) {
      setFetchError(err.message || 'Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEditToggle = useCallback(() => {
    setIsEditing(true);
    setSaveSuccess(false);
    setSaveError(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return; // Abort cancel
      }
    }
    
    // Revert form data to source of truth
    setFormData(profileData);
    setIsEditing(false);
    setIsDirty(false);
    setErrors({});
  }, [isDirty, profileData]);

  const handleChange = useCallback((fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setIsDirty(true);
    // Clear specific error on typing
    setErrors(prev => {
      if (prev[fieldId]) {
        const newErrs = { ...prev };
        delete newErrs[fieldId];
        return newErrs;
      }
      return prev;
    });
  }, []);

  const handleSave = useCallback(async () => {
    // 1. Validate
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSaveError('Please fix the validation errors before saving.');
      return;
    }

    // 2. Save
    setIsSaving(true);
    setSaveError(null);
    try {
      const updatedData = await profileApi.updateProfile(formData);
      const normalized = normalizeProfileData(updatedData);
      
      setProfileData(normalized);
      setFormData(normalized);
      
      setIsEditing(false);
      setIsDirty(false);
      setSaveSuccess(true);
      
      // Auto-hide success toast after 3s
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  return {
    state: {
      profileData,
      formData,
      isLoading,
      isSaving,
      isEditing,
      isDirty,
      fetchError,
      saveError,
      saveSuccess,
      errors
    },
    actions: {
      fetchProfile,
      handleEditToggle,
      handleCancel,
      handleChange,
      handleSave
    }
  };
};
