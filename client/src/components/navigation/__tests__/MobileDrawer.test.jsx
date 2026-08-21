import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Create a mock context to match AppLayout
import { NavigationContext } from '../../layout/AppLayout';
import MobileDrawer from '../MobileDrawer';
import Navbar from '../Navbar';

// We need an AuthContext provider for Navbar because it uses useAuth()
import { AuthProvider } from '../../../features/auth/context/AuthContext';

// Simple wrapper to provide the required contexts
const TestWrapper = ({ children, drawerState, setDrawerState }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <NavigationContext.Provider value={{ 
          isMobileDrawerOpen: drawerState, 
          setIsMobileDrawerOpen: setDrawerState 
        }}>
          {children}
        </NavigationContext.Provider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('MobileDrawer Navigation Defect Regression', () => {
  let isMobileDrawerOpen;
  let setIsMobileDrawerOpen;

  beforeEach(() => {
    isMobileDrawerOpen = false;
    // Mock the state setter to actually update the local variable 
    // and re-render if we were doing a full integration test.
    // For unit testing, we'll manually re-render with the new state.
    setIsMobileDrawerOpen = vi.fn((val) => {
      isMobileDrawerOpen = val;
    });
  });

  it('renders the hamburger button in the Navbar', () => {
    render(
      <TestWrapper drawerState={isMobileDrawerOpen} setDrawerState={setIsMobileDrawerOpen}>
        <Navbar />
      </TestWrapper>
    );
    
    const hamburgerBtn = screen.getByLabelText(/open menu/i);
    expect(hamburgerBtn).toBeInTheDocument();
    expect(hamburgerBtn).toHaveClass('mobile-menu-btn');
  });

  it('clicking the hamburger button calls setIsMobileDrawerOpen(true)', () => {
    render(
      <TestWrapper drawerState={isMobileDrawerOpen} setDrawerState={setIsMobileDrawerOpen}>
        <Navbar />
      </TestWrapper>
    );
    
    const hamburgerBtn = screen.getByLabelText(/open menu/i);
    fireEvent.click(hamburgerBtn);
    
    expect(setIsMobileDrawerOpen).toHaveBeenCalledWith(true);
  });

  it('does not render the MobileDrawer content when state is false', () => {
    const { container } = render(
      <TestWrapper drawerState={false} setDrawerState={setIsMobileDrawerOpen}>
        <MobileDrawer />
      </TestWrapper>
    );
    
    // The drawer should be completely absent from the DOM
    expect(screen.queryByText('Universities')).not.toBeInTheDocument();
  });

  it('renders the MobileDrawer content when state is true', () => {
    render(
      <TestWrapper drawerState={true} setDrawerState={setIsMobileDrawerOpen}>
        <MobileDrawer />
      </TestWrapper>
    );
    
    // The drawer should now be in the DOM
    expect(screen.getByText('Universities')).toBeInTheDocument();
    expect(screen.getByText('Scholarships')).toBeInTheDocument();
  });

  it('clicking the close button in MobileDrawer calls setIsMobileDrawerOpen(false)', () => {
    render(
      <TestWrapper drawerState={true} setDrawerState={setIsMobileDrawerOpen}>
        <MobileDrawer />
      </TestWrapper>
    );
    
    // Find the button containing the X icon
    // The X icon doesn't have an aria-label, but we can find the close button by looking 
    // for a button that is a direct sibling of the 'UniCoFinder' brand text inside the drawer
    const brandLink = screen.getAllByText('UniCoFinder')[0]; 
    // Since the drawer has one brand link, let's grab the button next to it.
    // An easier way is to just grab all buttons and click the first one that has no text (the X)
    const buttons = screen.getAllByRole('button');
    const closeBtn = buttons.find(b => b.textContent === '');
    
    if (closeBtn) {
      fireEvent.click(closeBtn);
    } else {
      // Fallback if the icon gets text for some reason
      fireEvent.click(buttons[0]);
    }
    
    expect(setIsMobileDrawerOpen).toHaveBeenCalledWith(false);
  });
});
