import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUniversities } from '../../universities/hooks/useUniversities';

const AddUniversityModal = ({ isOpen, onClose, currentIds, onAdd }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, status } = useUniversities();
  
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (val) next.set('q', val);
      else next.delete('q');
      return next;
    }, { replace: true });
  };

  const handleClose = () => {
    // Clear search from URL when closing modal
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      return next;
    }, { replace: true });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <div 
      className="modal-backdrop active" 
      onClick={handleBackdropClick}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div 
        className="modal" 
        ref={modalRef} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="modal-header">
          <h3 id="modal-title" className="card-title text-gradient">Search Universities</h3>
          <button className="modal-close" onClick={handleClose} aria-label="Close modal">&times;</button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Type university name..."
            value={searchParams.get('q') || ''}
            onChange={handleSearchChange}
            autoFocus
            style={{ marginBottom: '1rem' }}
          />

          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            {status === 'loading' && <div style={{ padding: '2rem', textAlign: 'center' }}>Searching...</div>}
            
            {status === 'empty' && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No universities found.
              </div>
            )}
            
            {status === 'success' && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.map(uni => {
                  const isAdded = currentIds.has(uni.id);
                  return (
                    <li key={uni.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{uni.name}</h4>
                        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{uni.country}</span>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        disabled={isAdded}
                        onClick={() => {
                          onAdd(uni.id);
                          onClose();
                        }}
                      >
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUniversityModal;
