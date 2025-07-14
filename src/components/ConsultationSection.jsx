import React from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const ConsultationSection = () => {
  const { openModal } = useBooking();

  return (
    <section className="py-20 bg-gradient-to-br from-peach to-lightBlue">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Book Your Free Consultation
        </motion.h2>
        
        <motion.p
          className="text-xl text-gray-600 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Take the first step towards healing and empowerment
        </motion.p>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-700 mb-6 leading-relaxed">
            Going through a divorce can feel overwhelming — emotionally, mentally, and even physically.
          </p>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            This free 30-minute Clarity Call is a safe, pressure-free space to share what you're experiencing. 
            Whether you're just starting your separation or feeling lost midway through, I'll help you unpack 
            what's going on and gently guide you toward your next step.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What to expect:</h3>
          
          <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
            <li>Talk through what's weighing on you</li>
            <li>Understand how emotional coaching could support your journey</li>
            <li>Decide whether working together feels like the right fit</li>
          </ul>
          
          <p className="text-gray-700 italic">
            There's no pressure to commit — just compassion, clarity, and direction.
          </p>
        </motion.div>

        <motion.button
          onClick={openModal}
          className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Schedule Your Clarity Call
        </motion.button>
      </div>
    </section>
  );
};

export default ConsultationSection;