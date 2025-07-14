import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useBooking } from '../context/BookingContext';
import supabase from '../lib/supabase';

const { FiUser, FiMenu, FiX } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const { openModal } = useBooking();
  const [loginUrl, setLoginUrl] = useState('#');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLoginSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('login_settings_dwd2024')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          console.log('Login settings fetched:', data);
          setLoginUrl(data.redirect_url || '#');
        }
      } catch (error) {
        console.error('Error fetching login settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginSettings();

    // Set up real-time subscription
    const subscription = supabase
      .channel('login_settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'login_settings_dwd2024' },
        (payload) => {
          console.log('Login settings changed:', payload);
          if (payload.new) {
            setLoginUrl(payload.new.redirect_url || '#');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleStartJourney = () => {
    openModal();
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-primary">
              Divorce with Direction
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/services"
              className={`font-medium transition-colors ${
                isActive('/services') ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              Services
            </Link>
            
            <motion.button
              onClick={openModal}
              className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
            </motion.button>
            
            <a
              href={loginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiUser} className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary transition-colors p-2"
            >
              <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/services"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/services') 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Services
                </Link>
                
                <button
                  onClick={handleStartJourney}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                >
                  Start Your Journey
                </button>
                
                <a
                  href={loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                  Login
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;