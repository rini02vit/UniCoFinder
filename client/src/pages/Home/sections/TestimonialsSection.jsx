import React from 'react';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import { TESTIMONIALS_CONFIG } from '../../../constants/home';
import { StaggerItem } from '../components/StaggerContainer';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <StaggerItem className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ color: 'var(--primary-cyan)', marginBottom: '1rem', opacity: 0.5 }}>
        <Quote size={32} />
      </div>
      <div className="card-body" style={{ fontStyle: 'italic', marginBottom: '1.5rem', flex: 1 }}>
        "{testimonial.content}"
      </div>
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div style={{ fontWeight: 600 }}>{testimonial.name}</div>
        <div className="state-desc" style={{ fontSize: '0.875rem', margin: 0 }}>{testimonial.role}</div>
      </div>
    </StaggerItem>
  );
};

const TestimonialsSection = () => {
  return (
    <Section id="testimonials" staggerChildren={true} style={{ background: 'rgba(255,255,255,0.02)' }}>
      <StaggerItem>
        <SectionHeader 
          title="Success Stories"
          subtitle="Hear from students who found their dream university through our platform."
        />
      </StaggerItem>

      <div className="grid-cards">
        {TESTIMONIALS_CONFIG.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </Section>
  );
};

export default TestimonialsSection;
