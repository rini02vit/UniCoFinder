import { useState } from 'react';
import { universitiesApi } from '../services/universitiesApi';

export const useWishlistMutation = (initialState = false) => {
  const [isWishlisted, setIsWishlisted] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);

  const toggleWishlist = async (universityId) => {
    const wasWishlisted = isWishlisted;
    // Optimistic Update
    setIsWishlisted(prev => !prev);
    setIsSaving(true);
    
    try {
      if (wasWishlisted) {
        await universitiesApi.removeFromWishlist(universityId);
      } else {
        await universitiesApi.addToWishlist(universityId);
      }
      // Success, toast would go here
    } catch (error) {
      // Rollback on failure
      setIsWishlisted(prev => !prev);
      console.error('Wishlist mutation failed', error);
      alert('Failed to save to wishlist. Please try again.'); // Minimal fallback
    } finally {
      setIsSaving(false);
    }
  };

  return { isWishlisted, isSaving, toggleWishlist };
};
