import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSave, FiRefreshCw, FiEdit3 } = FiIcons

const ContentBlockEditor = () => {
  const [contentBlocks, setContentBlocks] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const blockKeys = [
    'support_title',
    'coaching_title',
    'coaching_description',
    'messaging_title',
    'messaging_description',
    'scheduling_title',
    'scheduling_description'
  ]

  useEffect(() => {
    fetchContentBlocks()
  }, [])

  const fetchContentBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('section_content_dwd2024')
        .select('*')
        .in('key', blockKeys)

      if (error) throw error

      const blocksMap = {}
      data.forEach(block => {
        blocksMap[block.key] = block.content
      })
      setContentBlocks(blocksMap)
    } catch (error) {
      console.error('Error fetching content blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    try {
      const updates = Object.entries(contentBlocks).map(([key, content]) => ({
        key,
        content
      }))

      const { error } = await supabase
        .from('section_content_dwd2024')
        .upsert(updates)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving content blocks:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key, value) => {
    setContentBlocks(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getFieldLabel = (key) => {
    const labels = {
      'support_title': 'Support Section Title',
      'coaching_title': 'Coaching Service Title',
      'coaching_description': 'Coaching Service Description',
      'messaging_title': 'Messaging Service Title',
      'messaging_description': 'Messaging Service Description',
      'scheduling_title': 'Scheduling Service Title',
      'scheduling_description': 'Scheduling Service Description'
    }
    return labels[key] || key
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
            Content Block Editor
          </h2>
          <button
            onClick={fetchContentBlocks}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <SafeIcon icon={FiEdit3} className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">
                Homepage Support Section
              </h3>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Edit the "How I Support You" section content that appears on the homepage.
            </p>
          </div>

          {blockKeys.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getFieldLabel(key)}
              </label>
              {key.includes('description') ? (
                <textarea
                  value={contentBlocks[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={`Enter ${getFieldLabel(key).toLowerCase()}`}
                />
              ) : (
                <input
                  type="text"
                  value={contentBlocks[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={`Enter ${getFieldLabel(key).toLowerCase()}`}
                />
              )}
            </div>
          ))}

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
  )
}

export default ContentBlockEditor