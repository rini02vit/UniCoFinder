import React from 'react';
import { useTheme } from '../../../hooks/useTheme';

const BackgroundEffects = () => {
  const { theme } = useTheme();
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Static background glow, no animation needed here as it's handled by CSS
  return (
    <>
      <div className="bg-glow"></div>
      
      {/* Only render particles if the user has not requested reduced motion and we are not forcing a clean light mode without particles */}
      {!isReducedMotion && (
        <div className="particles-container" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* We rely on CSS animations defined in animations.css for the particles. 
              Inject a static set of elements to avoid heavy JS loop. */}
          <div className="float-item" style={{ left: '10%', top: '20%', '--dx': '300px', '--dy': '100px', animationDuration: '12s' }}>∑</div>
          <div className="float-item big" style={{ left: '80%', top: '10%', '--dx': '-200px', '--dy': '400px', animationDuration: '15s' }}>π</div>
          <div className="float-item" style={{ left: '40%', top: '70%', '--dx': '-100px', '--dy': '-300px', animationDuration: '10s' }}>∫</div>
          <div className="float-item" style={{ left: '90%', top: '80%', '--dx': '-400px', '--dy': '-100px', animationDuration: '14s' }}>∞</div>
          <div className="float-item big" style={{ left: '5%', top: '80%', '--dx': '400px', '--dy': '-200px', animationDuration: '16s' }}>Δ</div>
          <div className="float-item" style={{ left: '50%', top: '40%', '--dx': '200px', '--dy': '200px', animationDuration: '11s' }}>λ</div>
          <div className="float-item" style={{ left: '20%', top: '50%', '--dx': '150px', '--dy': '-150px', animationDuration: '13s' }}>GPA</div>
        </div>
      )}
    </>
  );
};

export default BackgroundEffects;
