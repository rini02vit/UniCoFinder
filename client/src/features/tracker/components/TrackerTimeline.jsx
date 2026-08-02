import React from 'react';

const TrackerTimeline = ({ stages, activeStage, completedStages }) => {
  return (
    <ol style={{ 
      listStyle: 'none', 
      padding: 0, 
      margin: '1.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Background track */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '20px',
        right: '20px',
        height: '4px',
        background: 'var(--border-color)',
        zIndex: 0
      }} />

      {/* Progress track */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '20px',
        width: stages.length > 1 ? `calc(${(Math.min(completedStages, stages.length - 1) / (stages.length - 1)) * 100}% - 20px)` : '0%',
        height: '4px',
        background: 'var(--primary-cyan)',
        zIndex: 1,
        transition: 'width 0.3s ease'
      }} />

      {stages.map((stage, index) => {
        const isCompleted = index <= completedStages;
        const isActive = index === activeStage;

        return (
          <li key={stage} style={{ 
            position: 'relative', 
            zIndex: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flex: 1
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isCompleted ? 'var(--primary-cyan)' : 'var(--bg-card)',
              border: `3px solid ${isCompleted ? 'var(--primary-cyan)' : 'var(--border-color)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isActive ? '0 0 0 4px rgba(14, 165, 233, 0.2)' : 'none',
              transition: 'all 0.3s ease'
            }} />
            <span style={{ 
              marginTop: '0.75rem', 
              fontSize: '0.85rem', 
              fontWeight: isActive ? 600 : 400,
              color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
              textAlign: 'center'
            }}>
              {stage}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default React.memo(TrackerTimeline);
