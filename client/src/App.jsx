import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppErrorBoundary from './components/layout/AppErrorBoundary';
import AppShell from './components/layout/AppShell';
import { ROUTES } from './constants/routes';
import { ThemeProvider } from './contexts/ThemeContext';
import RouteScrollManager from './components/ui/RouteScrollManager';
import BackToTopButton from './components/ui/BackToTopButton';
import FullScreenLoader from './components/ui/FullScreenLoader';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import ProtectedLayout from './components/layout/ProtectedLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth
import { AuthProvider } from './features/auth/context/AuthContext';
import { GuestRoute, ProtectedRoute, AdminRoute } from './features/auth/components/AuthRoutes';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';

// Pages (Static)
import Home from './pages/Home/Home';

// Pages (Lazy)
const Dashboard = React.lazy(() => import('./features/dashboard/pages/Dashboard'));
const UniversitiesPage = React.lazy(() => import('./features/universities/pages/UniversitiesPage'));
const UniversityDetailsPage = React.lazy(() => import('./features/universities/pages/UniversityDetailsPage'));
const AdmissionPredictorPage = React.lazy(() => import('./features/universities/pages/AdmissionPredictorPage'));
const CountriesPage = React.lazy(() => import('./features/countries/pages/CountriesPage'));
const CountryDetailsPage = React.lazy(() => import('./features/countries/pages/CountryDetailsPage'));
const ScholarshipsPage = React.lazy(() => import('./features/scholarships/pages/ScholarshipsPage'));
const ScholarshipDetailsPage = React.lazy(() => import('./features/scholarships/pages/ScholarshipDetailsPage'));
const ComparePage = React.lazy(() => import('./features/compare/pages/ComparePage'));
const BudgetPage = React.lazy(() => import('./features/budget/pages/BudgetPage'));
const ProfilePage = React.lazy(() => import('./features/profile/pages/ProfilePage'));
const TrackerPage = React.lazy(() => import('./features/tracker/pages/TrackerPage'));
const WishlistPage = React.lazy(() => import('./features/dashboard/pages/WishlistPage'));
const AIAdvisor = React.lazy(() => import('./pages/AIAdvisor/AIAdvisor'));
const AdminDashboard = React.lazy(() => import('./features/admin/pages/AdminDashboard'));
const AdminAnalytics = React.lazy(() => import('./features/admin/pages/AdminAnalytics'));
const ManageCountries = React.lazy(() => import('./features/admin/pages/ManageCountries'));
const ManageUniversities = React.lazy(() => import('./features/admin/pages/ManageUniversities'));
const ManageScholarships = React.lazy(() => import('./features/admin/pages/ManageScholarships'));
const ManageUsers = React.lazy(() => import('./features/admin/pages/ManageUsers'));
const UserDetails = React.lazy(() => import('./features/admin/pages/UserDetails'));
const AdminReports = React.lazy(() => import('./features/admin/pages/AdminReports'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <RouteScrollManager />
              <AppShell>
                <React.Suspense fallback={<FullScreenLoader />}>
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
                      <Route path={ROUTES.UNIVERSITY_DETAILS || '/university/:id'} element={<UniversityDetailsPage />} />
                      <Route path={ROUTES.COUNTRIES} element={<CountriesPage />} />
                      <Route path={ROUTES.COUNTRY_DETAILS} element={<CountryDetailsPage />} />
                      <Route path={ROUTES.SCHOLARSHIPS || '/scholarships'} element={<ScholarshipsPage />} />
                      <Route path={`${ROUTES.SCHOLARSHIPS || '/scholarships'}/:id`} element={<ScholarshipDetailsPage />} />
                      <Route path={ROUTES.COMPARE || '/compare'} element={<ComparePage />} />
                      <Route path={ROUTES.BUDGET || '/budget'} element={<BudgetPage />} />
                      <Route path={ROUTES.AI_ADVISOR || '/ai-advisor'} element={<AIAdvisor />} />
                      <Route path="/predictor" element={<AdmissionPredictorPage />} />
                      <Route path={ROUTES.PROFILE || '/profile'} element={<ProfilePage />} />
                      <Route path={ROUTES.APPLICATION_TRACKER || '/tracker'} element={<TrackerPage />} />
                      <Route path={ROUTES.WISHLIST || '/wishlist'} element={<WishlistPage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/analytics" element={<AdminAnalytics />} />
                      <Route path="/admin/countries" element={<ManageCountries />} />
                      <Route path="/admin/universities" element={<ManageUniversities />} />
                      <Route path="/admin/scholarships" element={<ManageScholarships />} />
                      <Route path="/admin/users" element={<ManageUsers />} />
                      <Route path="/admin/users/:id" element={<UserDetails />} />
                      <Route path="/admin/reports" element={<AdminReports />} />
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
