import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import { FEATURES_CONFIG } from '../../../constants/home';
import { StaggerItem } from '../components/StaggerContainer';

const FeaturesSection = () => {
  return (
    <Section id="features" staggerChildren={true}>
      <StaggerItem>
        <SectionHeader 
          title="Why Choose UniCoFinder?"
          subtitle="Everything you need to plan your study abroad journey in one seamless platform."
        />
      </StaggerItem>

      <div className="grid-cards">
        {FEATURES_CONFIG.map((feature) => {
          const Icon = feature.icon;
          return (
            <StaggerItem key={feature.id} className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '12px', color: 'var(--primary-cyan)' }}>
                  <Icon size={24} />
                </div>
                <h3 className="card-title">{feature.title}</h3>
              </div>
              <div className="card-body">
                <p>{feature.description}</p>
              </div>
              <div className="card-footer">
                <Link to={feature.destinationRoute} className="btn btn-secondary btn-block">
                  {feature.buttonLabel}
                </Link>
              </div>
            </StaggerItem>
          );
        })}
      </div>
    </Section>
  );
};

export default FeaturesSection;
