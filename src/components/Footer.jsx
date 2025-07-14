import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import supabase from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiPhone } = FiIcons;

const Footer = () => {
  const { openModal } = useBooking();
  const [footerData, setFooterData] = useState({
    email: '',
    whatsapp_link: '',
    copyright_year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('footer_settings_dwd2024')
          .select('*')
          .single();

        if (error) throw error;
        if (data) {
          console.log('Footer data fetched:', data);
          setFooterData(data);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('footer_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'footer_settings_dwd2024' }, 
        (payload) => {
          console.log('Footer data changed:', payload);
          if (payload.new) {
            setFooterData(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <footer className="bg-darkGray text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-primary mb-4">
              Divorce with Direction
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Compassionate emotional coaching for women navigating divorce. Find your strength, clarity, and direction through personalized support.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <button onClick={openModal} className="text-gray-300 hover:text-white transition-colors">
                  Start Your Journey
                </button>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            {!loading && (
              <>
                {footerData.email && (
                  <a
                    href={`mailto:${footerData.email}`}
                    className="flex items-center text-gray-300 hover:text-white transition-colors mb-2"
                  >
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                    {footerData.email}
                  </a>
                )}
                {footerData.whatsapp_link && (
                  <a
                    href={footerData.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                )}
              </>
            )}
            <p className="text-gray-300 text-sm leading-relaxed mt-4">
              Sessions are conducted via Zoom for your convenience and comfort.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mt-4">
              <strong>Crisis Support:</strong> If you're in immediate crisis, please contact emergency services or a crisis hotline.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {footerData.copyright_year || new Date().getFullYear()} Divorce with Direction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;