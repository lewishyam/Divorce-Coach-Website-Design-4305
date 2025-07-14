import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../lib/supabase';
import { useBooking } from '../context/BookingContext';

const { FiHeart, FiClock } = FiIcons;

const ServicesPage = () => {
  const { openModal } = useBooking();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services...');
        const { data, error } = await supabase
          .from('services_dwd2024')
          .select('*')
          .order('order_num', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
          throw error;
        }

        console.log('Services fetched:', data);
        // Filter visible services here in the component instead of in the query
        const visibleServices = data.filter(service => service.visible === true);
        setServices(visibleServices);
      } catch (error) {
        console.error('Error in fetchServices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Set up real-time subscription
    const subscription = supabase
      .channel('services_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'services_dwd2024' },
        (payload) => {
          console.log('Services changed:', payload);
          fetchServices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
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
            Katie provides personalized emotional coaching to help women navigate the challenges of divorce with confidence, clarity, and strength.
          </motion.p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {/* Service Icon */}
                  <div className="p-6 pb-4 text-center">
                    {service.icon_url ? (
                      <img 
                        src={service.icon_url} 
                        alt={service.name}
                        className="w-16 h-16 mx-auto object-contain mb-4"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <SafeIcon icon={FiHeart} className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Service Content */}
                  <div className="px-6 pb-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                      {service.name}
                    </h3>
                    
                    {service.price && (
                      <p className="text-primary font-medium mb-3 text-center">
                        {service.price}
                      </p>
                    )}
                    
                    <p className="text-gray-600 mb-6 text-center flex-1">
                      {service.description}
                    </p>
                    
                    <motion.a
                      href={service.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors block text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Book Now
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
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
              Katie is currently setting up her coaching services. Please check back soon or contact her directly for more information about upcoming availability.
            </p>
          </motion.div>
        )}

        {/* Features Section */}
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
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <SafeIcon icon={feature.icon} className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
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