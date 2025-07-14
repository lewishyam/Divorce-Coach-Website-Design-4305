import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../../lib/supabase';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiRefreshCw } = FiIcons;

const HeroEditor = () => {
  const [heroData, setHeroData] = useState({
    id: 1, // Explicitly set an ID for upsert
    title: '',
    secondary_title: '',
    subtitle: '',
    cta_button_text: '',
    cta_button_link: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('hero_content_dwd2024')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching hero data:', error);
        if (error.code !== 'PGRST116') { // No rows returned
          throw error;
        }
      }
      
      if (data) {
        console.log('Hero data fetched:', data);
        setHeroData({
          id: data.id || 1,
          title: data.title || '',
          secondary_title: data.secondary_title || '',
          subtitle: data.subtitle || '',
          cta_button_text: data.cta_button_text || '',
          cta_button_link: data.cta_button_link || ''
        });
      }
    } catch (err) {
      console.error('Error in fetchHeroData:', err);
      setError('Failed to load hero data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      console.log('Saving hero data:', heroData);
      
      // Ensure we have an ID for upsert
      const dataToSave = {
        ...heroData,
        id: heroData.id || 1
      };
      
      const { error } = await supabase
        .from('hero_content_dwd2024')
        .upsert(dataToSave);

      if (error) {
        console.error('Error saving hero data:', error);
        throw error;
      }
      
      console.log('Hero data saved successfully');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setHeroData(prev => ({ ...prev, [field]: value }));
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
            Hero Section Editor
          </h2>
          <button
            onClick={fetchHeroData}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Title
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter main title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Title (appears in red)
            </label>
            <input
              type="text"
              value={heroData.secondary_title}
              onChange={(e) => handleChange('secondary_title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter secondary title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={heroData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter subtitle"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={heroData.cta_button_text}
                onChange={(e) => handleChange('cta_button_text', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter button text"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                value={heroData.cta_button_link}
                onChange={(e) => handleChange('cta_button_link', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter button link"
                required
              />
            </div>
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
                  Changes saved successfully!
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroEditor;