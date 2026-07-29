import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="state-container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="state-icon error">404</div>
        <h3 className="state-title">Page Not Found</h3>
        <p className="state-desc">The page you are looking for doesn't exist or has been moved.</p>
        <button className="btn btn-primary" onClick={() => navigate(ROUTES.HOME)}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
