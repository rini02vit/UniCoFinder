import { useState, useCallback, useEffect } from 'react';
import { trackerApi } from '../services/trackerApi';

/**
 * Manages isolated checklist state for a specific application.
 * Persists changes through the backend API.
 */
export const useChecklistState = (application) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize state from application.documentsCompleted
  useEffect(() => {
    if (!application) return;
    const initialChecked = {};
    const docs = application.documentsCompleted || [];
    docs.forEach(doc => { initialChecked[doc] = true; });
    setCheckedItems(initialChecked);
  }, [application]);

  const toggleItem = useCallback(async (itemId) => {
    if (!application || isUpdating) return;

    // Optimistic UI update
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    setIsUpdating(true);

    try {
      const currentDocs = application.documentsCompleted || [];
      const isCurrentlyChecked = currentDocs.includes(itemId);
      
      let nextDocs;
      if (isCurrentlyChecked) {
        nextDocs = currentDocs.filter(doc => doc !== itemId);
      } else {
        nextDocs = [...currentDocs, itemId];
      }

      // Persist to backend
      const updatedApp = await trackerApi.updateApplication(application.id, { 
        documentsCompleted: nextDocs 
      });
      
      // Update local state to match server response exactly
      const updatedChecked = {};
      (updatedApp.documentsCompleted || []).forEach(doc => { updatedChecked[doc] = true; });
      setCheckedItems(updatedChecked);
      
      // Mutate the original application reference to keep it in sync for subsequent toggles
      application.documentsCompleted = updatedApp.documentsCompleted;

    } catch (e) {
      console.error('Failed to update checklist state', e);
      // Revert optimistic update
      const revertedChecked = {};
      (application.documentsCompleted || []).forEach(doc => { revertedChecked[doc] = true; });
      setCheckedItems(revertedChecked);
    } finally {
      setIsUpdating(false);
    }
  }, [application, isUpdating]);

  return {
    checkedItems,
    toggleItem,
    isUpdating
  };
};
