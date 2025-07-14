import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import supabase from '../lib/supabase';

const HeroSection = () => {
  const { openModal } = useBooking();
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    cta_button_text: 'Start Your Journey',
    secondary_title: 'Through Change'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hero_content_dwd2024')
          .select('*')
          .single();

        if (error) throw error;
        if (data) {
          console.log('Hero data fetched:', data);
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();

    const subscription = supabase
      .channel('hero_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hero_content_dwd2024' },
        (payload) => {
          console.log('Hero data changed:', payload);
          if (payload.new) {
            setHeroData(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="relative bg-hero-gradient overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-16 w-48 h-48 bg-accent/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-lg"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center w-full
            py-8 sm:py-12 
            lg:py-16 xl:py-14 2xl:py-12"
        >
          <div className="w-full text-center">
            {/* Main Heading */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-2 sm:mb-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {heroData.title || 'Find Your Strength'}
              <br />
              <span className="text-primary">
                {heroData.secondary_title || 'Through Change'}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-700 
                mb-4 sm:mb-6 md:mb-8 
                max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {heroData.subtitle || 'Compassionate emotional coaching for women navigating divorce. Discover clarity, build confidence, and create your path forward.'}
            </motion.p>

            {/* Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                onClick={openModal}
                className="bg-primary text-white px-8 py-3 sm:py-4 rounded-full 
                  text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg
                  min-w-[200px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {heroData.cta_button_text || 'Start Your Journey'}
              </motion.button>

              <Link to="/services">
                <motion.button
                  className="bg-white text-primary px-8 py-3 sm:py-4 rounded-full 
                    text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg 
                    border border-primary/20
                    min-w-[200px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Services
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;