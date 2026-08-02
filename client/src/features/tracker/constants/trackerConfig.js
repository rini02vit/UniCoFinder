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
  { id: 'c1', label: 'Complete Application Form' },
  { id: 'c2', label: 'Submit Statement of Purpose' },
  { id: 'c3', label: 'Upload Transcripts' },
  { id: 'c4', label: 'Pay Application Fee' },
  { id: 'c5', label: 'Submit Letters of Recommendation' }
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
