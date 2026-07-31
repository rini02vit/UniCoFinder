import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const AuthLayout = ({ children, navActionText, navActionRoute }) => {
  return (
    <>
      <div className="bg-glow"></div>
      
      <div className="app-container">
        <nav className="navbar" style={{ position: 'relative', zIndex: 10 }}>
          <div className="navbar-brand">
            <Link to={ROUTES.HOME} className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none' }}>
              UniCoFinder
            </Link>
          </div>
          {navActionText && navActionRoute && (
            <div className="navbar-nav">
              <Link to={navActionRoute} className="btn btn-outline" style={{ padding: '0.5rem 1.2rem' }}>
                {navActionText}
              </Link>
            </div>
          )}
        </nav>

        <main className="main-content" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem 1rem'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.5rem',
            position: 'relative',
            zIndex: 10
          }}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
