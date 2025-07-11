import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart } = FiIcons;

const IntroSection = () => {
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
          Meet Katie
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Katie is a compassionate emotional coach dedicated to supporting women through 
          one of life's most challenging transitions. With her warm, empathetic approach 
          and deep understanding of the emotional complexities of divorce, she provides 
          a safe space for healing, growth, and rediscovering your inner strength. 
          Through personalized coaching sessions, Katie helps you navigate uncertainty 
          with confidence and clarity.
        </motion.p>
      </div>
    </section>
  );
};

export default IntroSection;