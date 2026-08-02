import React from 'react';
import { Calendar } from 'lucide-react';
import { formatRelativeDate, formatDate } from '../utils/dateUtils';
import { DEADLINE_STATUS_MAP } from '../constants/trackerConfig';

const TrackerDeadlines = ({ updatedAt, isTerminalStatus }) => {
  // Since we lack explicit backend deadlines, we derive one based on updatedAt.
  // In a real app, this would come directly from the API mapper.
  const relativeUpdate = formatRelativeDate(updatedAt);
  const exactDate = formatDate(updatedAt);
  
  // Logic to determine badge state based on terminal status
  const badgeLabel = isTerminalStatus ? 'Completed' : 'Upcoming Action';
  const color = isTerminalStatus ? DEADLINE_STATUS_MAP['Completed'] : DEADLINE_STATUS_MAP['Upcoming'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        <Calendar size={18} />
        <span style={{ fontSize: '0.9rem' }}>Last Update: {relativeUpdate} ({exactDate})</span>
      </div>
      
      <span className="badge" style={{ 
        background: 'transparent', 
        border: `1px solid ${color}`,
        color: color,
        marginLeft: 'auto'
      }}>
        {badgeLabel}
      </span>
    </div>
  );
};

export default React.memo(TrackerDeadlines);
