export const TIMELINE_STAGES = [
  'Drafting',
  'Submitted',
  'Under Review',
  'Interview',
  'Decision'
];

export const STATUS_CONFIG = {
  'Drafting': { index: 0, color: 'var(--text-secondary)' },
  'Pending': { index: 2, color: 'var(--warning)' }, // Maps to 'Under Review' conceptually from API
  'Interview': { index: 3, color: 'var(--primary-blue)' },
  'Accepted': { index: 4, color: 'var(--success)' },
  'Rejected': { index: 4, color: 'var(--danger)' }
};

export const CHECKLIST_TEMPLATE = [
  { id: 'passport', label: 'Passport' },
  { id: 'sop', label: 'SOP' },
  { id: 'lor', label: 'LOR' },
  { id: 'resume', label: 'Resume' },
  { id: 'ielts', label: 'IELTS' },
  { id: 'gre', label: 'GRE' },
  { id: 'financialDocuments', label: 'Financial Documents' },
  { id: 'visaDocuments', label: 'Visa Documents' }
];

export const STATUS_BADGE_MAP = {
  'Drafting': 'default',
  'Pending': 'warning',
  'Interview': 'info',
  'Accepted': 'success',
  'Rejected': 'danger'
};

export const DEADLINE_STATUS_MAP = {
  'Overdue': 'var(--danger)',
  'Soon': 'var(--warning)',
  'Upcoming': 'var(--primary-cyan)',
  'Completed': 'var(--success)'
};

export const PROGRESS_RULES = {
  'Drafting': 10,
  'Pending': 50,
  'Interview': 75,
  'Accepted': 100,
  'Rejected': 100
};

export const TIMELINE_ICONS = {
  'Drafting': 'Edit',
  'Submitted': 'Send',
  'Under Review': 'Search',
  'Interview': 'Users',
  'Decision': 'CheckCircle'
};
