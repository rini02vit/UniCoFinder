import { PROGRESS_RULES, CHECKLIST_TEMPLATE } from '../constants/trackerConfig';

/**
 * Calculates workflow progress derived entirely from API status
 * @param {string} status 
 * @returns {number} 0-100
 */
export const calculateWorkflowProgress = (status) => {
  return PROGRESS_RULES[status] || 0;
};

/**
 * Calculates checklist completion progress based on UI local state
 * @param {Object} checkedItems Map of id -> boolean
 * @returns {number} 0-100
 */
export const calculateChecklistProgress = (checkedItems = {}) => {
  if (!CHECKLIST_TEMPLATE || CHECKLIST_TEMPLATE.length === 0) return 0;
  
  let completedCount = 0;
  CHECKLIST_TEMPLATE.forEach(item => {
    if (checkedItems[item.id]) {
      completedCount++;
    }
  });

  return Math.round((completedCount / CHECKLIST_TEMPLATE.length) * 100);
};

/**
 * Derives an overall aggregated progress metric
 * @param {string} status 
 * @param {Object} checkedItems 
 * @returns {number} 0-100
 */
export const calculateOverallProgress = (status, checkedItems) => {
  const workflow = calculateWorkflowProgress(status);
  const checklist = calculateChecklistProgress(checkedItems);
  
  return Math.round((workflow + checklist) / 2);
};
