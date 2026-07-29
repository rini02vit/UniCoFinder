import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import FadeIn from '../components/FadeIn';
import { ROUTES } from '../../../constants/routes';

const CTASection = () => {
  return (
    <Section id="cta" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
      <FadeIn delay={0.2}>
        <div className="state-container" style={{ 
          background: 'var(--card-bg)', 
          borderColor: 'var(--primary-purple)',
          boxShadow: '0 0 40px rgba(167, 139, 250, 0.1)',
          padding: '4rem 2rem'
        }}>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to Start Your Journey?
          </h2>
          <p className="state-desc" style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Join thousands of students who have already found their perfect university and secured funding with UniCoFinder.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.REGISTER} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Create Free Account
            </Link>
            <Link to={ROUTES.UNIVERSITIES} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore Universities
            </Link>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
};

export default CTASection;
