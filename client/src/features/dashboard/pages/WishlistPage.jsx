import React, { useState } from 'react';
import { useDashboardWishlist } from '../providers/DashboardProvider';
import { dashboardApi } from '../services/dashboardApi';
import { universitiesApi } from '../../universities/services/universitiesApi';
import WishlistCard from '../components/WishlistCard';
import { GridSkeleton } from '../../universities/components/listing/GridSkeleton';

const WishlistPage = () => {
  const { data: wishlist, status, error, refetch } = useDashboardWishlist();
  const [updatingId, setUpdatingId] = useState(null);

  const handleRemove = async (id) => {
    try {
      setUpdatingId(id);
      await universitiesApi.toggleWishlist(id);
      await refetch();
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveMetadata = async (id, metadata) => {
    try {
      setUpdatingId(id);
      await dashboardApi.updateWishlistMetadata(id, metadata);
      await refetch();
    } catch (err) {
      console.error('Failed to update wishlist metadata', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem' }}>
        <h2>My Wishlist</h2>
        <p className="text-secondary">Keep track of your favorite universities, add notes, and prioritize.</p>
      </header>

      <div aria-live="polite">
        {status === 'loading' && <GridSkeleton count={4} />}
        
        {status === 'error' && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon error">⚠️</div>
            <h3 className="state-title">Failed to load wishlist</h3>
            <p className="state-desc">{error?.message || 'Please check your connection and try again.'}</p>
          </div>
        )}

        {status === 'success' && (!wishlist || wishlist.length === 0) && (
          <div className="state-container" style={{ marginTop: '2rem' }}>
            <div className="state-icon empty">📋</div>
            <h3 className="state-title">Your wishlist is empty</h3>
            <p className="state-desc">You haven't saved any universities yet.</p>
          </div>
        )}

        {status === 'success' && wishlist && wishlist.length > 0 && (
          <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {wishlist.map(uni => (
              <WishlistCard 
                key={uni._id || uni.id} 
                university={uni} 
                onRemove={handleRemove}
                onSaveMetadata={handleSaveMetadata}
                isUpdating={updatingId === (uni._id || uni.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
