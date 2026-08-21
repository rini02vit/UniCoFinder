import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SavedUniversitiesWidget from '../widgets/universities/SavedUniversitiesWidget';
import { useDashboardWishlist } from '../providers/DashboardProvider';

// Mock the hook
vi.mock('../providers/DashboardProvider', () => ({
  useDashboardWishlist: vi.fn(),
}));

describe('SavedUniversitiesWidget', () => {
  it('should render the university name (currently fails due to known defect)', () => {
    // This test asserts the INTENDED behavior:
    // The widget should render the actual university name from item.university.name
    useDashboardWishlist.mockReturnValue({
      status: 'success',
      data: [
        {
          id: '1',
          university: {
            name: 'Harvard University',
            country: 'USA'
          }
        }
      ],
      error: null,
      refetch: vi.fn(),
    });

    render(<SavedUniversitiesWidget />);

    // INTENDED: It should find Harvard University
    expect(screen.getByText('Harvard University')).toBeInTheDocument();
    
    // It should NOT fallback to 'Unknown University'
    expect(screen.queryByText('Unknown University')).not.toBeInTheDocument();
  });

  it('should render loading state correctly', () => {
    useDashboardWishlist.mockReturnValue({
      status: 'loading',
      data: null,
      error: null,
      refetch: vi.fn(),
    });

    render(<SavedUniversitiesWidget />);
    // Our ListSkeleton probably doesn't have text, but we can verify the header
    expect(screen.getByText('Saved Universities')).toBeInTheDocument();
  });

  it('should render empty state correctly', () => {
    useDashboardWishlist.mockReturnValue({
      status: 'empty',
      data: [],
      error: null,
      refetch: vi.fn(),
    });

    render(<SavedUniversitiesWidget />);
    expect(screen.getByText('No saved universities yet')).toBeInTheDocument();
  });
});
