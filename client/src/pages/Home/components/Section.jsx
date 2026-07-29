import React from 'react';
import StaggerContainer from './StaggerContainer';

const Section = ({ 
  children, 
  id, 
  className = '', 
  style = {},
  hasContainer = true,
  staggerChildren = false
}) => {
  const content = hasContainer ? (
    <div className="container">
      {children}
    </div>
  ) : children;

  return (
    <section 
      id={id} 
      className={`py-16 ${className}`} // Add consistent vertical rhythm
      style={{ padding: '4rem 0', ...style }} // Fallback if py-16 isn't defined
    >
      {staggerChildren ? (
        <StaggerContainer>
          {content}
        </StaggerContainer>
      ) : content}
    </section>
  );
};

export default Section;
