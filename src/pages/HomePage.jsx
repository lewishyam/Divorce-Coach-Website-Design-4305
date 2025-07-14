import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import ConsultationSection from '../components/ConsultationSection';
import ServicePreview from '../components/ServicePreview';
import TestimonialsSection from '../components/TestimonialsSection';

const HomePage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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