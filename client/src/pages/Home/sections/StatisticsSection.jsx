import React from 'react';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import AnimatedCounter from '../components/AnimatedCounter';
import { STATS_CONFIG } from '../../../constants/home';
import { StaggerItem } from '../components/StaggerContainer';

const StatisticsSection = () => {
  return (
    <Section id="statistics" staggerChildren={true} style={{ background: 'rgba(255,255,255,0.02)' }}>
      <StaggerItem>
        <SectionHeader 
          title="Trusted by Students Worldwide"
        />
      </StaggerItem>

      <div className="grid-cards">
        {STATS_CONFIG.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.id} className="card" style={{ alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--primary-purple)' }}>
                <Icon size={32} />
              </div>
              <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>
                <AnimatedCounter value={stat.value} duration={2} />
                {stat.suffix}
              </div>
              <p className="state-desc" style={{ marginTop: '0.5rem', fontWeight: 500 }}>
                {stat.label}
              </p>
            </StaggerItem>
          );
        })}
      </div>
    </Section>
  );
};

export default StatisticsSection;
