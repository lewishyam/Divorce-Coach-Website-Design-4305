import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials_dwd2024')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log('Testimonials fetched:', data);
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();

    // Set up real-time subscription
    const subscription = supabase
      .channel('testimonial_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'testimonials_dwd2024' }, 
        (payload) => {
          console.log('Testimonial data changed:', payload);
          fetchTestimonials(); // Refetch all testimonials on any change
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

  if (testimonials.length === 0) {
    return null; // Don't show the section if there are no testimonials
  }

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

        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {testimonial.photo_url && (
                <div className="mb-6">
                  <img
                    src={testimonial.photo_url}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                </div>
              )}
              <p className="text-lg text-gray-600 italic mb-6">
                "{testimonial.text}"
              </p>
              <p className="text-gray-900 font-semibold">
                {testimonial.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;