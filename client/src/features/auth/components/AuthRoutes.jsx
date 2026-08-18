import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../../../constants/routes';

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="full-screen-loader"><div className="spinner"></div></div>;
  }

  // If authenticated, redirect to dashboard or the redirect param if exists
  if (isAuthenticated) {
    const redirectPath = new URLSearchParams(location.search).get('redirect') || ROUTES.DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="full-screen-loader"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="full-screen-loader"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.DASHBOARD || '/dashboard'} replace />;
  }

  return children;
};

