import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Clients Are Saying
        </motion.h2>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg text-gray-600 italic">
            "Testimonials will appear here soon."
          </p>
          <div className="mt-8 text-sm text-gray-500">
            <p>This section is structured to showcase client testimonials including:</p>
            <ul className="mt-2 space-y-1">
              <li>• Client testimonial text</li>
              <li>• Client name</li>
              <li>• Optional client photo</li>
              <li>• Grid or carousel layout when populated</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;