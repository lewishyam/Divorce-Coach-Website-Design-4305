import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiClock } = FiIcons;

const ServicesPage = () => {
  const features = [
    {
      icon: FiHeart,
      title: 'Compassionate Support',
      description: 'Receive empathetic guidance tailored to your unique situation and emotional needs.',
      color: 'text-red-500'
    },
    {
      icon: FiIcons.FiUsers,
      title: 'Personalized Guidance',
      description: 'One-on-one coaching sessions designed specifically for your journey and goals.',
      color: 'text-accent'
    },
    {
      icon: FiClock,
      title: 'Flexible Scheduling',
      description: 'Book sessions at times that work for your schedule, with convenient online meetings.',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <SafeIcon icon={FiHeart} className="w-16 h-16 text-primary" />
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Coaching Services
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Katie provides personalized emotional coaching to help women navigate the challenges 
            of divorce with confidence, clarity, and strength. Through compassionate support and 
            practical guidance, you'll discover your path forward.
          </motion.p>
        </div>

        <motion.div
          className="bg-gray-50 rounded-2xl p-12 text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <SafeIcon icon={FiClock} className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Services Coming Soon
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            Katie is currently setting up her coaching services. Please check back soon 
            or contact her directly for more information about upcoming availability.
          </p>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-12">
            All Sessions Include
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <SafeIcon 
                  icon={feature.icon} 
                  className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} 
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServicesPage;