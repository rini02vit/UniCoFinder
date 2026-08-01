export const ELIGIBILITY_METRICS_CONFIG = [
  { key: 'targetRegion', label: 'Target Region', icon: '🌍' },
  { key: 'degreeLevel', label: 'Degree Level', icon: '🎓' },
  { key: 'minGpa', label: 'Minimum GPA', icon: '📊' },
  { key: 'languageReq', label: 'Language Requirements', icon: '🗣️' }
];

export const DEADLINE_STATUS_MAP = {
  OPEN: {
    label: 'Open',
    className: 'badge-green',
    icon: '✅'
  },
  CLOSING_SOON: {
    label: 'Closing Soon',
    className: 'badge-orange',
    icon: '⏳'
  },
  CLOSED: {
    label: 'Closed',
    className: 'badge-red',
    icon: '❌'
  },
  UNKNOWN: {
    label: 'Unknown Deadline',
    className: 'badge-gray',
    icon: '📅'
  }
};
