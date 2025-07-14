import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';

const PrivacyPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('privacy_policy_dwd2024')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;

        console.log('Privacy policy fetched:', data);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setContent('Privacy policy content is currently unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();

    // Set up real-time subscription
    const subscription = supabase
      .channel('privacy_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'privacy_policy_dwd2024' },
        (payload) => {
          console.log('Privacy policy changed:', payload);
          if (payload.new) {
            setContent(payload.new.content);
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
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;