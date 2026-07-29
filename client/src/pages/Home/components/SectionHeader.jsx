import React from 'react';
import Reveal from './Reveal';

const SectionHeader = ({ 
  title, 
  subtitle, 
  gradientTitle = false, 
  align = 'center',
  className = ''
}) => {
  return (
    <div className={`mb-4 ${align === 'center' ? 'text-center' : ''} ${className}`} style={{ marginBottom: '3rem' }}>
      <Reveal>
        <h2 className={gradientTitle ? 'text-gradient' : ''} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {title}
        </h2>
      </Reveal>
      
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="state-desc" style={{ maxWidth: '600px', margin: align === 'center' ? '0 auto' : '0' }}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
};

export default SectionHeader;
