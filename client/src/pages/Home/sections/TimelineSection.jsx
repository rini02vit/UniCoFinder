import React from 'react';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import { TIMELINE_CONFIG } from '../../../constants/home';
import { StaggerItem } from '../components/StaggerContainer';

const TimelineStep = ({ step }) => {
  const Icon = step.icon;
  return (
    <StaggerItem className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{ 
        flexShrink: 0, 
        width: '48px', 
        height: '48px', 
        borderRadius: '50%', 
        background: 'var(--gradient-btn)', 
        color: '#0b0f1a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      }}>
        {step.order}
      </div>
      <div>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Icon size={20} className="text-gradient" />
          {step.title}
        </h3>
        <p className="state-desc" style={{ margin: 0 }}>{step.description}</p>
      </div>
    </StaggerItem>
  );
};

const TimelineSection = () => {
  return (
    <Section id="timeline" staggerChildren={true}>
      <StaggerItem>
        <SectionHeader 
          title="How It Works"
          subtitle="Your journey to studying abroad simplified in four easy steps."
        />
      </StaggerItem>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        {TIMELINE_CONFIG.map((step) => (
          <TimelineStep key={step.order} step={step} />
        ))}
      </div>
    </Section>
  );
};

export default TimelineSection;
