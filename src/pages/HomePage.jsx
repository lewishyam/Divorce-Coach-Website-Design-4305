import React from 'react';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import ConsultationSection from '../components/ConsultationSection';
import ServicePreview from '../components/ServicePreview';
import TestimonialsSection from '../components/TestimonialsSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <IntroSection />
      <ConsultationSection />
      <ServicePreview />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;