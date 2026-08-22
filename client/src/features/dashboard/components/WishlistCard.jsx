import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WishlistCard = ({
  university,
  onSaveMetadata,
  onRemove,
  isUpdating = false
}) => {
  const {
    _id,
    name,
    location,
    images,
    ranking,
    matchStatus,
    tuitionFee,
    acceptanceRate,
    note: initialNote = '',
    priority: initialPriority = 'Medium'
  } = university;

  const [note, setNote] = useState(initialNote);
  const [priority, setPriority] = useState(initialPriority);

  const handleSave = () => {
    onSaveMetadata(_id, { note, priority });
  };

  const getPriorityBadgeClass = (prio) => {
    switch (prio) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-orange';
      case 'Low': return 'badge-green'; // Or secondary
      default: return 'badge-orange';
    }
  };

  const image = images?.cover || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80';
  const locString = location ? `${location.city}, ${location.country}` : 'Location unknown';

  return (
    <div className="card">
      <div 
        className="uni-image" 
        style={{ 
          height: '160px',
          width: '100%',
          borderRadius: '12px',
          marginBottom: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img 
          src={image} 
          alt={name ? `Cover image for ${name}` : ''}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button 
          onClick={() => onRemove(_id)}
          className="btn"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Remove from Wishlist"
        >
          ✕
        </button>
      </div>
      <div className="card-header" style={{ marginBottom: '0.5rem' }}>
        <h3 className="card-title">{name}</h3>
        <span className="text-secondary">{locString}</span>
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {ranking?.qs && (
            <span className="badge badge-purple">#{ranking.qs} World</span>
          )}
          {matchStatus && (
            <span className={`badge ${matchStatus.includes('Safe') ? 'badge-green' : 'badge-orange'}`}>
              {matchStatus}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9rem' }}>
            Tuition: {tuitionFee ? `$${tuitionFee.toLocaleString()}/yr` : 'N/A'}
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Acceptance: {acceptanceRate ? `${acceptanceRate}%` : 'N/A'}
          </p>
        </div>

        {/* Wishlist Metadata Editor */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Priority</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-input"
              style={{ width: '120px', padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}
              disabled={isUpdating}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
              Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a personal note..."
              className="form-input"
              style={{ width: '100%', minHeight: '60px', resize: 'vertical', padding: '0.5rem', fontSize: '0.9rem' }}
              maxLength={1000}
              disabled={isUpdating}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
              {note.length}/1000
            </div>
          </div>
        </div>

      </div>
      <div className="card-footer" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ flex: 1, padding: '0.5rem 1rem' }}
          onClick={handleSave}
          disabled={isUpdating || (note === initialNote && priority === initialPriority)}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
        <Link to={`/university/${_id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
          Details
        </Link>
      </div>
    </div>
  );
};

export default WishlistCard;
