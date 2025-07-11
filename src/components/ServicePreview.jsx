import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiVideo, FiMessageCircle, FiCalendar } = FiIcons;

const ServicePreview = () => {
  const services = [
    {
      icon: FiVideo,
      title: 'One-on-One Video Coaching',
      description: 'Personalized sessions via secure video calls to provide focused support and guidance.',
      color: 'text-primary'
    },
    {
      icon: FiMessageCircle,
      title: 'Ongoing Message Support',
      description: 'Continuous support through secure messaging for questions and encouragement between sessions.',
      color: 'text-accent'
    },
    {
      icon: FiCalendar,
      title: 'Flexible Scheduling',
      description: 'Book sessions at times that work for your schedule with easy online booking.',
      color: 'text-primary'
    }
  ];

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
            How I Support You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive emotional coaching designed to meet you where you are in your journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <SafeIcon 
                icon={service.icon} 
                className={`w-12 h-12 mx-auto mb-4 ${service.color}`} 
              />
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