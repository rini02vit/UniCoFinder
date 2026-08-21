import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from '../components/AuthRoutes';
import { vi } from 'vitest';
import * as AuthContextModule from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AuthRoutes', () => {
  const ProtectedComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;
  const AdminComponent = () => <div>Admin Content</div>;

  describe('ProtectedRoute', () => {
    it('should render children if authenticated', () => {
      AuthContextModule.useAuth.mockReturnValue({ isAuthenticated: true, loading: false });
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/protected" element={<ProtectedRoute><ProtectedComponent /></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      );
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to login if not authenticated', () => {
      AuthContextModule.useAuth.mockReturnValue({ isAuthenticated: false, loading: false });
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/protected" element={<ProtectedRoute><ProtectedComponent /></ProtectedRoute>} />
            <Route path="/login" element={<LoginComponent />} />
          </Routes>
        </MemoryRouter>
      );
      
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('should render children if user is admin', () => {
      AuthContextModule.useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'admin' }, loading: false });
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<AdminRoute><AdminComponent /></AdminRoute>} />
          </Routes>
        </MemoryRouter>
      );
      
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should redirect to /dashboard if user is student', () => {
      AuthContextModule.useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'student' }, loading: false });
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<AdminRoute><AdminComponent /></AdminRoute>} />
            <Route path="/dashboard" element={<div>Student Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );
      
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });
});
