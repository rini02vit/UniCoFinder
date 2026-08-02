import React from 'react';

const TrackerChecklist = ({ template, checkedItems, onToggle, disabled }) => {
  if (!template || template.length === 0) return null;

  return (
    <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Application Tasks</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {template.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id={`check-${item.id}`}
                checked={isChecked}
                onChange={() => onToggle(item.id)}
                disabled={disabled}
                style={{
                  marginTop: '0.2rem',
                  cursor: disabled ? 'not-allowed' : 'pointer'
                }}
              />
              <label 
                htmlFor={`check-${item.id}`}
                style={{
                  color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                  flex: 1
                }}
              >
                {item.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default React.memo(TrackerChecklist);
