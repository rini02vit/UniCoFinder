import React from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import StatisticsSection from './sections/StatisticsSection';
import TimelineSection from './sections/TimelineSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';

const Home = () => {
  return (
    <>
      <BackgroundEffects />
      
      <HeroSection />
      <FeaturesSection />
      <StatisticsSection />
      <TimelineSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
};

export default Home;
