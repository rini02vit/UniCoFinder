import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { universitiesApi } from '../services/universitiesApi';
import { ROUTES } from '../../../constants/routes';

export const useApplicationMutation = (initialAppliedState = false) => {
  const [hasApplied, setHasApplied] = useState(initialAppliedState);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const apply = async (universityId) => {
    if (hasApplied) return;
    
    setIsApplying(true);
    
    try {
      await universitiesApi.applyToUniversity(universityId);
      setHasApplied(true);
      // Navigate to tracker on success
      navigate(ROUTES.TRACKER || '/tracker');
    } catch (error) {
      console.error('Application mutation failed', error);
      alert('Failed to start application. Please try again.'); // Minimal fallback
    } finally {
      setIsApplying(false);
    }
  };

  return { hasApplied, isApplying, apply };
};
