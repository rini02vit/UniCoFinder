import React, { useState } from 'react';

const GallerySection = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '3rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>University Gallery</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {gallery.map((imgUrl, index) => (
          <div 
            key={index} 
            style={{
              aspectRatio: '16/9',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              position: 'relative',
              backgroundColor: 'var(--bg-secondary)'
            }}
            onClick={() => setSelectedImage(imgUrl)}
          >
            <img 
              src={imgUrl} 
              alt={`Gallery image ${index + 1}`} 
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>

      {/* Simple Lightbox Modal */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          <img 
            src={selectedImage} 
            alt="Fullscreen view" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              borderRadius: '8px'
            }} 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GallerySection;
