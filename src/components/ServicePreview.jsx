import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const ServicePreview = () => {
  const [content, setContent] = useState({
    support_title: '',
    coaching_title: '',
    coaching_description: '',
    messaging_title: '',
    messaging_description: '',
    scheduling_title: '',
    scheduling_description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('section_content_dwd2024')
          .select('*');

        if (error) throw error;
        
        const contentMap = {};
        data.forEach(item => {
          contentMap[item.key] = item.content;
        });
        
        console.log('Service content fetched:', contentMap);
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // Set up real-time subscription
    const subscription = supabase
      .channel('content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'section_content_dwd2024' }, 
        (payload) => {
          console.log('Content data changed:', payload);
          if (payload.new) {
            setContent(prev => ({
              ...prev,
              [payload.new.key]: payload.new.content
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const services = [
    {
      key: 'coaching',
      title: content.coaching_title,
      description: content.coaching_description,
      color: 'text-primary'
    },
    {
      key: 'messaging',
      title: content.messaging_title,
      description: content.messaging_description,
      color: 'text-accent'
    },
    {
      key: 'scheduling',
      title: content.scheduling_title,
      description: content.scheduling_description,
      color: 'text-primary'
    }
  ];

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            {content.support_title || 'How I Support You'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive emotional coaching designed to meet you where you are in your journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.key}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/services">
            <motion.button
              className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Services
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicePreview;