import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSave, FiRefreshCw, FiExternalLink } = FiIcons

const LoginEditor = () => {
  const [redirectUrl, setRedirectUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchLoginSettings()
  }, [])

  const fetchLoginSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('login_settings_dwd2024')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error

      setRedirectUrl(data.redirect_url)
    } catch (error) {
      console.error('Error fetching login settings:', error)
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
        .from('login_settings_dwd2024')
        .upsert({ redirect_url: redirectUrl })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving login settings:', error)
    } finally {
      setSaving(false)
    }
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
            Login Settings
          </h2>
          <button
            onClick={fetchLoginSettings}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <SafeIcon icon={FiExternalLink} className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">
              Client Portal Redirect
            </h3>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Set the URL where the "Login" button in the navigation should redirect users (e.g., your client portal).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redirect URL
            </label>
            <input
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://app.divorcewithdirection.com"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              This URL will be used for the "Login" button in the main navigation.
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
                  Login settings saved successfully!
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

export default LoginEditor