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

// Pages
import Home from './pages/Home/Home';
const Dashboard = () => <div style={{ padding: '2rem' }}><h1>Dashboard Page</h1></div>;
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        {/* <AuthProvider> */}
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
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedLayout />}>
                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                  </Route>
                </Routes>
              </React.Suspense>
              <BackToTopButton />
            </AppShell>
          </BrowserRouter>
        {/* </AuthProvider> */}
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
