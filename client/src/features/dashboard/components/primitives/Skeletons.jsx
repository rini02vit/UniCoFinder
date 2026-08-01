import React from 'react';

export const WidgetSkeleton = () => (
  <div className="card" style={{ padding: '2.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
    <div style={{ width: '40%', height: '24px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginBottom: '1.5rem' }}></div>
    <div style={{ width: '100%', height: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '0.75rem' }}></div>
    <div style={{ width: '80%', height: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="stat-card" style={{ padding: '1.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', display: 'flex', gap: '1rem' }}>
    <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--border-color)', borderRadius: '12px' }}></div>
    <div style={{ flex: 1 }}>
      <div style={{ width: '60%', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
      <div style={{ width: '40%', height: '24px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 3 }) => (
  <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
        <div style={{ width: '40%', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
        <div style={{ width: '20%', height: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <div style={{ width: '40%', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
      <div style={{ width: '10%', height: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
    </div>
    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1.5rem' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <div style={{ width: '30%', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
      <div style={{ width: '10%', height: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
    </div>
    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1.5rem' }}></div>
  </div>
);
