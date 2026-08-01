import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppErrorBoundary from './components/layout/AppErrorBoundary';
import AppShell from './components/layout/AppShell';
import { ROUTES } from './constants/routes';
import { ThemeProvider } from './contexts/ThemeContext';
import RouteScrollManager from './components/ui/RouteScrollManager';
import BackToTopButton from './components/ui/BackToTopButton';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Auth
import { AuthProvider } from './features/auth/context/AuthContext';
import { GuestRoute, ProtectedRoute } from './features/auth/components/AuthRoutes';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';

// Pages
import Home from './pages/Home/Home';
import Dashboard from './features/dashboard/pages/Dashboard';
import UniversitiesPage from './features/universities/pages/UniversitiesPage';
import UniversityDetailsPage from './features/universities/pages/UniversityDetailsPage';
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <RouteScrollManager />
              <AppShell>
                <React.Suspense fallback={null}>
                  <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path={ROUTES.HOME} element={<Home />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                    
                    {/* Auth Routes */}
                    <Route path={ROUTES.LOGIN} element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path={ROUTES.REGISTER} element={<GuestRoute><Register /></GuestRoute>} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<GuestRoute><ForgotPassword /></GuestRoute>} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                      <Route path={ROUTES.DASHBOARD || '/dashboard'} element={<Dashboard />} />
                      <Route path={ROUTES.UNIVERSITIES || '/universities'} element={<UniversitiesPage />} />
                      <Route path={`${ROUTES.UNIVERSITIES || '/universities'}/:id`} element={<UniversityDetailsPage />} />
                    </Route>
                  </Routes>
                </React.Suspense>
                <BackToTopButton />
              </AppShell>
            </BrowserRouter>
          </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
