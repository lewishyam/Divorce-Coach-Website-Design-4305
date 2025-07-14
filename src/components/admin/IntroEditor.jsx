import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiSave, FiRefreshCw, FiUpload, FiTrash2 } = FiIcons

const IntroEditor = () => {
  const [introData, setIntroData] = useState({
    heading: '',
    body: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchIntroData()
  }, [])

  const fetchIntroData = async () => {
    try {
      const { data, error } = await supabase
        .from('intro_section_dwd2024')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error

      setIntroData(data)
    } catch (error) {
      console.error('Error fetching intro data:', error)
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
        .from('intro_section_dwd2024')
        .upsert(introData)

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving intro data:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setIntroData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `intro-${Date.now()}.${fileExt}`
      const filePath = `intro/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('admin-uploads')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('admin-uploads')
        .getPublicUrl(filePath)

      handleChange('image_url', publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    handleChange('image_url', '')
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
            Intro Section Editor
          </h2>
          <button
            onClick={fetchIntroData}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading
            </label>
            <input
              type="text"
              value={introData.heading}
              onChange={(e) => handleChange('heading', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter heading"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Text
            </label>
            <textarea
              value={introData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter body text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            
            {introData.image_url ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={introData.image_url}
                    alt="Intro section"
                    className="w-48 h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                </label>
              </div>
            )}
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
              disabled={saving || uploading}
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

export default IntroEditor