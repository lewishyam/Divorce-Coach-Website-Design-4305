import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSave, FiRefreshCw } = FiIcons

const FooterEditor = () => {
  const [footerData, setFooterData] = useState({
    email: '',
    whatsapp_link: '',
    copyright_year: new Date().getFullYear()
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchFooterData()
  }, [])

  const fetchFooterData = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_settings_dwd2024')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error

      setFooterData(data)
    } catch (error) {
      console.error('Error fetching footer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('footer_settings_dwd2024')
        .upsert(footerData)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving footer data:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Footer Settings
          </h2>
          <button
            onClick={fetchFooterData}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={footerData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="contact@divorcewithdirection.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Link
            </label>
            <input
              type="url"
              value={footerData.whatsapp_link}
              onChange={(e) => handleChange('whatsapp_link', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://wa.me/1234567890"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: https://wa.me/[country code][phone number]
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copyright Year
            </label>
            <input
              type="number"
              value={footerData.copyright_year}
              onChange={(e) => handleChange('copyright_year', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              min="2020"
              max="2030"
              required
            />
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
                  Footer settings saved successfully!
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FooterEditor