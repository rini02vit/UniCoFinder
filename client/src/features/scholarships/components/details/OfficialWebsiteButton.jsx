import React from 'react';

const OfficialWebsiteButton = ({ url }) => {
  if (!url) {
    return (
      <button 
        className="btn btn-primary" 
        style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
        aria-disabled="true"
        onClick={(e) => e.preventDefault()}
        title="Official website link is unavailable at this time."
      >
        Website Unavailable
      </button>
    );
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary"
      style={{ 
        width: '100%', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '0.5rem',
        textDecoration: 'none'
      }}
      aria-label="Open official scholarship website in new tab"
    >
      Visit Official Website
      <span aria-hidden="true">↗</span>
    </a>
  );
};

export default OfficialWebsiteButton;
