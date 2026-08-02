import { useState, useCallback, useEffect } from 'react';

/**
 * Manages isolated checklist state in localStorage for a specific application.
 * Key format: tracker-checklist-<applicationId>
 */
export const useChecklistState = (applicationId) => {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (!applicationId) return;
    
    try {
      const key = `tracker-checklist-${applicationId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure graceful handling of corrupted or old data formats
        if (typeof parsed === 'object' && parsed !== null) {
          setCheckedItems(parsed.items || parsed); // support future versioning wrapper `{ version: 1, items: {} }`
        } else {
          setCheckedItems({});
        }
      } else {
        setCheckedItems({});
      }
    } catch (e) {
      console.error('Failed to parse checklist state. Resetting to empty.', e);
      setCheckedItems({});
    }
  }, [applicationId]);

  const toggleItem = useCallback((itemId) => {
    if (!applicationId) return;

    setCheckedItems(prev => {
      const newState = {
        ...prev,
        [itemId]: !prev[itemId]
      };
      
      try {
        const key = `tracker-checklist-${applicationId}`;
        // Wrapped with a version for future structural migrations
        const payload = { version: 1, items: newState };
        localStorage.setItem(key, JSON.stringify(payload));
      } catch (e) {
        console.error('Failed to save checklist state', e);
      }
      
      return newState;
    });
  }, [applicationId]);

  return {
    checkedItems,
    toggleItem
  };
};
