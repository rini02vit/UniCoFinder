import React from 'react';
import FadeIn from '../components/FadeIn';
import HomeSearchBar from './HomeSearchBar';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <FadeIn delay={0.1}>
          <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
            Global Education Explorer
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Discover top universities, secure funding, and map out your perfect academic journey worldwide.
          </p>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <HomeSearchBar />
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
