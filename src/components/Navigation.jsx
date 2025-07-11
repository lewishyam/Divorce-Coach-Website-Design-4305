import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useBooking } from '../context/BookingContext';

const { FiUser } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const { openModal } = useBooking();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-primary">
              Divorce with Direction
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`font-medium transition-colors ${
                isActive('/services') 
                  ? 'text-primary' 
                  : 'text-gray-700 hover:text-primary'
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
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiUser} className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary">
              <SafeIcon icon={FiIcons.FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;