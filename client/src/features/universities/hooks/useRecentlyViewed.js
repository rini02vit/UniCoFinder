import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recentlyViewedUniversities';
const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recently viewed universities:', error);
    }
  }, []);

  const addRecentlyViewed = (university) => {
    if (!university || !university._id) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : [];

      // Create lightweight snapshot
      const snapshot = {
        _id: university._id,
        name: university.name,
        country: university.country,
        city: university.city,
        image: university.image,
        ranking: university.ranking,
        cgpaRequirement: university.cgpaRequirement,
      };

      // Remove if already exists to move it to the top
      list = list.filter((item) => item._id !== snapshot._id);

      // Add to beginning
      list.unshift(snapshot);

      // Enforce max items
      if (list.length > MAX_ITEMS) {
        list = list.slice(0, MAX_ITEMS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setRecentlyViewed(list);
    } catch (error) {
      console.error('Error saving recently viewed university:', error);
    }
  };

  const clearRecentlyViewed = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentlyViewed([]);
    } catch (error) {
      console.error('Error clearing recently viewed universities:', error);
    }
  };

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
};
