import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronDown, FiChevronUp } = FiIcons;

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('faqs_dwd2024')
          .select('*')
          .order('order_num', { ascending: true });

        if (error) throw error;

        console.log('FAQs fetched:', data);
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();

    // Set up real-time subscription
    const subscription = supabase
      .channel('faq_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'faqs_dwd2024' },
        (payload) => {
          console.log('FAQ data changed:', payload);
          fetchFaqs(); // Refetch all FAQs on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <SafeIcon 
                    icon={openIndex === index ? FiChevronUp : FiChevronDown}
                    className="w-5 h-5 text-gray-500"
                  />
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          {faqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No FAQs available at this time.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;