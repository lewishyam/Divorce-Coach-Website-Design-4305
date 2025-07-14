import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../../lib/supabase';

const { FiSave, FiRefreshCw } = FiIcons;

const CalendarEditor = () => {
  // Initial state with default values
  const [calendarData, setCalendarData] = useState({
    booking_url: 'https://tidycal.com/dwd/clarity-call'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    fetchCalendarData();
  }, []);
  
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_settings_dwd2024')
        .select('*')
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }
      
      if (data) {
        setCalendarData({
          booking_url: data.booking_url
        });
      } else {
        // Create default settings if none exist
        const { error: insertError } = await supabase
          .from('calendar_settings_dwd2024')
          .insert([calendarData]);
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('calendar_settings_dwd2024')
        .upsert(calendarData);
        
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving calendar data:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setCalendarData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Calendar Settings
          </h2>
          <button
            onClick={fetchCalendarData}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TidyCal Booking URL
            </label>
            <input
              type="url"
              value={calendarData.booking_url}
              onChange={(e) => handleChange('booking_url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://tidycal.com/yourusername/appointment-name"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This direct URL will be used in the booking modal
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center">
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center text-green-600 mr-4"
                >
                  <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5 mr-2" />
                  Calendar settings saved successfully!
                </motion.div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Calendar Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarEditor;