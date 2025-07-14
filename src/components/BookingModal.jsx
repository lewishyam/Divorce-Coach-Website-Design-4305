import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useBooking } from '../context/BookingContext';
import supabase from '../lib/supabase';

const { FiX } = FiIcons;

const BookingModal = () => {
  const { isModalOpen, closeModal } = useBooking();
  const [bookingUrl, setBookingUrl] = useState("https://tidycal.com/dwd/clarity-call");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingUrl = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('calendar_settings_dwd2024')
          .select('booking_url')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data && data.booking_url) {
          setBookingUrl(data.booking_url);
        }
      } catch (error) {
        console.error('Error fetching booking URL:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingUrl();
    
    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('booking_url_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'calendar_settings_dwd2024' },
        (payload) => {
          if (payload.new && payload.new.booking_url) {
            setBookingUrl(payload.new.booking_url);
          }
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading || !isModalOpen) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  Book Your Free Consultation
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-0 overflow-hidden h-[70vh]">
              <iframe 
                src={bookingUrl}
                frameBorder="0" 
                className="w-full h-full"
                title="Book Your Consultation"
                allow="camera; microphone; autoplay; encrypted-media; fullscreen;"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;