import React, { useState, useEffect } from 'react';
import { universitiesApi } from '../services/universitiesApi';
import ReviewForm from './ReviewForm';

const ReviewList = ({ universityId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await universitiesApi.getReviews(universityId, { page: pageNum, limit: 5 });
      setReviews(res.data.reviews);
      setStats(res.data.stats);
      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [universityId, page]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await universitiesApi.deleteReview(universityId, reviewId);
      // Refetch current page
      fetchReviews(page);
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  const handleReviewCreated = () => {
    setShowForm(false);
    setPage(1);
    fetchReviews(1);
  };

  const currentUserId = localStorage.getItem('userId'); // assuming standard auth flow

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Student Reviews</h3>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        )}
      </div>

      {stats.totalReviews > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.averageRating}
          </div>
          <div>
            <div style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>
              {'★'.repeat(Math.round(stats.averageRating))}
              <span style={{ color: 'var(--border-color)' }}>
                {'★'.repeat(5 - Math.round(stats.averageRating))}
              </span>
            </div>
            <div className="text-secondary" style={{ fontSize: '0.9rem' }}>
              Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ReviewForm 
          universityId={universityId} 
          onSuccess={handleReviewCreated} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && reviews.length === 0 && !showForm && (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p className="text-secondary">No reviews yet. Be the first to review this university!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {reviews.map(review => (
          <div key={review._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 'bold' }}>{review.user ? review.user.name : 'Deleted User'}</div>
              <div style={{ color: 'var(--accent)' }}>{'★'.repeat(review.rating)}</div>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{review.comment}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span className="text-secondary">{new Date(review.createdAt).toLocaleDateString()}</span>
              {currentUserId && review.user && review.user._id === currentUserId && (
                <button 
                  onClick={() => handleDelete(review._id)} 
                  className="btn btn-outline" 
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="btn btn-outline" 
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button 
            className="btn btn-outline" 
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
