import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiPlus, FiEdit3, FiTrash2, FiEye, FiEyeOff, FiUpload, FiSave, FiX } = FiIcons

const ServicesManager = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyService = {
    name: '',
    description: '',
    price: '',
    booking_url: '',
    icon_url: '',
    order_num: 0,
    visible: true
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services_dwd2024')
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error

      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (serviceData) => {
    setSaving(true)
    try {
      if (serviceData.id) {
        // Update existing service
        const { error } = await supabase
          .from('services_dwd2024')
          .update(serviceData)
          .eq('id', serviceData.id)

        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase
          .from('services_dwd2024')
          .insert([serviceData])

        if (error) throw error
      }

      await fetchServices()
      setEditingService(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('services_dwd2024')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleToggleVisibility = async (id, visible) => {
    try {
      const { error } = await supabase
        .from('services_dwd2024')
        .update({ visible: !visible })
        .eq('id', id)

      if (error) throw error

      await fetchServices()
    } catch (error) {
      console.error('Error updating visibility:', error)
    }
  }

  const ServiceForm = ({ service, onSave, onCancel }) => {
    const [formData, setFormData] = useState(service || emptyService)
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
        const fileName = `service-${Date.now()}.${fileExt}`
        const filePath = `services/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('admin-uploads')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('admin-uploads')
          .getPublicUrl(filePath)

        handleChange('icon_url', publicUrl)
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setUploading(false)
      }
    }

    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Optional)
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., $150/session"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking URL
            </label>
            <input
              type="url"
              value={formData.booking_url}
              onChange={(e) => handleChange('booking_url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://calendly.com/..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order_num}
                onChange={(e) => handleChange('order_num', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon/Image
              </label>
              <div className="flex items-center space-x-4">
                {formData.icon_url && (
                  <img
                    src={formData.icon_url}
                    alt="Service icon"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="icon-upload"
                />
                <label
                  htmlFor="icon-upload"
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Icon'}
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible}
              onChange={(e) => handleChange('visible', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="visible" className="text-sm text-gray-700">
              Visible on services page
            </label>
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
              {saving ? 'Saving...' : 'Save Service'}
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Services Manager
          </h2>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add New Service
          </button>
        </div>

        {isAddingNew && (
          <ServiceForm
            onSave={handleSave}
            onCancel={() => setIsAddingNew(false)}
          />
        )}

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              {editingService?.id === service.id ? (
                <ServiceForm
                  service={editingService}
                  onSave={handleSave}
                  onCancel={() => setEditingService(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {service.icon_url && (
                      <img
                        src={service.icon_url}
                        alt={service.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.name}
                        {service.price && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({service.price})
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Order: {service.order_num} | Booking: {service.booking_url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(service.id, service.visible)}
                      className={`p-2 rounded-lg transition-colors ${
                        service.visible
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={service.visible ? 'Hide service' : 'Show service'}
                    >
                      <SafeIcon icon={service.visible ? FiEye : FiEyeOff} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found. Add your first service to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServicesManager