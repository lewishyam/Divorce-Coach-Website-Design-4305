import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../lib/supabase';

const { FiHeart } = FiIcons;

const IntroSection = () => {
  const [introData, setIntroData] = useState({
    heading: '',
    body: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntroData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('intro_section_dwd2024')
          .select('*')
          .single();

        if (error) throw error;
        if (data) {
          console.log('Intro data fetched:', data);
          setIntroData(data);
        }
      } catch (error) {
        console.error('Error fetching intro data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('intro_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'intro_section_dwd2024' }, 
        (payload) => {
          console.log('Intro data changed:', payload);
          if (payload.new) {
            setIntroData(payload.new);
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
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <SafeIcon icon={FiHeart} className="w-16 h-16 text-primary" />
        </motion.div>

        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {introData.heading || 'Meet Katie'}
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {introData.body || 'Katie is a compassionate emotional coach dedicated to supporting women through one of life\'s most challenging transitions. With her warm, empathetic approach and deep understanding of the emotional complexities of divorce, she provides a safe space for healing, growth, and rediscovering your inner strength.'}
        </motion.p>

        {introData.image_url && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <img
              src={introData.image_url}
              alt="Katie"
              className="mx-auto rounded-lg shadow-lg max-w-md w-full"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default IntroSection;