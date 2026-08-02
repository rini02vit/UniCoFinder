import React from 'react';

const ProfileValue = ({ value, placeholder }) => {
  const displayValue = value === '' || value === null || value === undefined ? '-' : value;
  
  return (
    <div className="profile-value" style={{ 
      padding: '0.5rem 0',
      color: displayValue === '-' ? 'var(--text-secondary)' : 'var(--text-primary)',
      fontWeight: 500
    }}>
      {displayValue}
    </div>
  );
};

export default React.memo(ProfileValue);
