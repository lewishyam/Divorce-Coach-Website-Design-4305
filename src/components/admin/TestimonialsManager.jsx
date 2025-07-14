import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiPlus, FiEdit3, FiTrash2, FiUpload, FiSave, FiUser } = FiIcons

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyTestimonial = {
    name: '',
    text: '',
    photo_url: ''
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials_dwd2024')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTestimonials(data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (testimonialData) => {
    setSaving(true)
    try {
      if (testimonialData.id) {
        // Update existing testimonial
        const { error } = await supabase
          .from('testimonials_dwd2024')
          .update(testimonialData)
          .eq('id', testimonialData.id)

        if (error) throw error
      } else {
        // Create new testimonial
        const { error } = await supabase
          .from('testimonials_dwd2024')
          .insert([testimonialData])

        if (error) throw error
      }

      await fetchTestimonials()
      setEditingTestimonial(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error('Error saving testimonial:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const { error } = await supabase
        .from('testimonials_dwd2024')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const TestimonialForm = ({ testimonial, onSave, onCancel }) => {
    const [formData, setFormData] = useState(testimonial || emptyTestimonial)
    const [uploading, setUploading] = useState(false)

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    const handleChange = (field, value) => {
      setFormData(prev => ({
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
        const fileName = `testimonial-${Date.now()}.${fileExt}`
        const filePath = `testimonials/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('admin-uploads')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('admin-uploads')
          .getPublicUrl(filePath)

        handleChange('photo_url', publicUrl)
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setUploading(false)
      }
    }

    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Sarah M."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Text
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter the testimonial text..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {formData.photo_url ? (
                <img
                  src={formData.photo_url}
                  alt="Client photo"
                  className="w-16 h-16 object-cover rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>
        </form>
      </div>
    )
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
            Testimonials Manager
          </h2>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add New Testimonial
          </button>
        </div>

        {isAddingNew && (
          <TestimonialForm
            onSave={handleSave}
            onCancel={() => setIsAddingNew(false)}
          />
        )}

        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
              {editingTestimonial?.id === testimonial.id ? (
                <TestimonialForm
                  testimonial={editingTestimonial}
                  onSave={handleSave}
                  onCancel={() => setEditingTestimonial(null)}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {testimonial.photo_url ? (
                      <img
                        src={testimonial.photo_url}
                        alt={testimonial.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-600 mt-1 italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTestimonial(testimonial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials found. Add your first testimonial to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestimonialsManager