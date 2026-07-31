import React from 'react';

const AuthForm = ({ 
  onSubmit, 
  title, 
  subtitle, 
  footerText, 
  footerLinkText, 
  footerLinkRoute, 
  children, 
  submitText, 
  isLoading,
  globalError
}) => {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
        {subtitle && <p className="text-secondary" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>

      {globalError && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          color: '#ef4444', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }} role="alert">
          {globalError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {children}

        <button 
          type="submit" 
          className="btn btn-primary btn-block mt-2" 
          style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          disabled={isLoading}
        >
          {isLoading && <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>}
          {isLoading ? 'Processing...' : submitText}
        </button>
      </form>

      {footerText && footerLinkText && footerLinkRoute && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {footerText} <a href={footerLinkRoute} style={{ color: 'var(--primary-cyan)', textDecoration: 'none', fontWeight: 500 }}>{footerLinkText}</a>
        </div>
      )}
    </>
  );
};

export default AuthForm;
