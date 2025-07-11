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
          className="bg-white rounded-2xl shadow-xl p-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              Calendar integration will be embedded here
            </p>
            <div className="text-sm text-gray-500">
              <p>Embed code placeholder for booking calendar</p>
              <p className="mt-2">
                (e.g., Calendly, Acuity Scheduling, or similar service)
              </p>
            </div>
          </div>
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
          Start Your Journey
        </motion.button>
      </div>
    </section>
  );
};

export default ConsultationSection;