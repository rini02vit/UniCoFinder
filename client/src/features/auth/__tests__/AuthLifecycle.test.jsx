import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProtectedRoute, GuestRoute } from '../components/AuthRoutes';
import { authApi } from '../services/authApi';
import { vi } from 'vitest';

vi.mock('../services/authApi', () => ({
  authApi: {
    getCurrentUser: vi.fn(),
  },
}));

// Components to simulate the app
const Dashboard = () => {
  const { logout, isAuthenticated } = useAuth();
  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <button type="button" onClick={logout}>Logout Button</button>
    </div>
  );
};

const Login = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <h1>Login Page</h1>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
    </div>
  );
};

const Register = () => <h1>Register Page</h1>;

describe('Authentication Lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderApp = (initialRoute = '/') => {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('Unauthenticated user attempting to access protected route is redirected to /login', async () => {
    renderApp('/dashboard');
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('Authenticated user attempting to access protected route is granted access', async () => {
    localStorage.setItem('token', 'fake-valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 1, role: 'student' } } });
    
    renderApp('/dashboard');
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard (Protected)')).toBeInTheDocument();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });

  it('Authenticated user -> logout -> authentication state cleared and redirected to /login', async () => {
    localStorage.setItem('token', 'fake-valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 1, role: 'student' } } });
    
    renderApp('/dashboard');
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard (Protected)')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const logoutBtn = screen.getByText('Logout Button');
    await user.click(logoutBtn);

    // After clicking logout, state should clear and ProtectedRoute should redirect to /login
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('After logout, /login and /register are fully accessible', async () => {
    localStorage.setItem('token', 'fake-valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 1, role: 'student' } } });
    
    const { unmount } = renderApp('/dashboard');
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard (Protected)')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText('Logout Button'));

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    // Remount to simulate navigation to /register
    unmount();
    renderApp('/register');

    await waitFor(() => {
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });
  });

  it('Invalid/stale token does not create a redirect loop but gracefully falls back to /login', async () => {
    localStorage.setItem('token', 'fake-invalid-token');
    authApi.getCurrentUser.mockRejectedValueOnce(new Error('Invalid token'));
    
    renderApp('/dashboard');
    
    // AuthProvider will catch the error, clear localStorage, set authenticated to false
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('Existing authenticated-user behavior on /login and /register remains unchanged (redirects to /dashboard)', async () => {
    localStorage.setItem('token', 'fake-valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 1, role: 'student' } } });
    
    // Visit login while authenticated
    const { unmount } = renderApp('/login');
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard (Protected)')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    unmount();
    
    authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 1, role: 'student' } } });
    
    // Visit register while authenticated
    renderApp('/register');

    await waitFor(() => {
      expect(screen.getByText('Dashboard (Protected)')).toBeInTheDocument();
      expect(screen.queryByText('Register Page')).not.toBeInTheDocument();
    });
  });
});
