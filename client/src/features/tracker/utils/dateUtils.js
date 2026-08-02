/**
 * Formats an ISO string to a human-readable date.
 * @param {string} isoString 
 * @returns {string} e.g. "Oct 12, 2023"
 */
export const formatDate = (isoString) => {
  if (!isoString) return 'Unknown Date';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

/**
 * Formats a date relatively (e.g. "2 days ago", "Today")
 * @param {string} isoString 
 * @returns {string}
 */
export const formatRelativeDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === -1) return 'Tomorrow';
    
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < -1 && diffDays > -7) return `In ${Math.abs(diffDays)} days`;
    
    if (diffDays >= 7 && diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return formatDate(isoString);
  } catch (e) {
    return formatDate(isoString);
  }
};
