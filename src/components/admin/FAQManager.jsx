import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiPlus, FiEdit3, FiTrash2, FiSave, FiChevronUp, FiChevronDown } = FiIcons

const FAQManager = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingFaq, setEditingFaq] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyFaq = {
    question: '',
    answer: '',
    order_num: 0
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs_dwd2024')
        .select('*')
        .order('order_num', { ascending: true })

      if (error) throw error

      setFaqs(data)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (faqData) => {
    setSaving(true)
    try {
      if (faqData.id) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs_dwd2024')
          .update(faqData)
          .eq('id', faqData.id)

        if (error) throw error
      } else {
        // Create new FAQ
        const { error } = await supabase
          .from('faqs_dwd2024')
          .insert([faqData])

        if (error) throw error
      }

      await fetchFaqs()
      setEditingFaq(null)
      setIsAddingNew(false)
    } catch (error) {
      console.error('Error saving FAQ:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const { error } = await supabase
        .from('faqs_dwd2024')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchFaqs()
    } catch (error) {
      console.error('Error deleting FAQ:', error)
    }
  }

  const handleReorder = async (id, direction) => {
    const faqIndex = faqs.findIndex(f => f.id === id)
    const faq = faqs[faqIndex]
    const targetIndex = direction === 'up' ? faqIndex - 1 : faqIndex + 1

    if (targetIndex < 0 || targetIndex >= faqs.length) return

    const targetFaq = faqs[targetIndex]

    try {
      // Swap order numbers
      const { error } = await supabase
        .from('faqs_dwd2024')
        .upsert([
          { id: faq.id, order_num: targetFaq.order_num },
          { id: targetFaq.id, order_num: faq.order_num }
        ])

      if (error) throw error

      await fetchFaqs()
    } catch (error) {
      console.error('Error reordering FAQ:', error)
    }
  }

  const FAQForm = ({ faq, onSave, onCancel }) => {
    const [formData, setFormData] = useState(faq || emptyFaq)

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

    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter the FAQ question"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => handleChange('answer', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter the FAQ answer"
              required
            />
          </div>

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
              disabled={saving}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save FAQ'}
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
            FAQ Manager
          </h2>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add New FAQ
          </button>
        </div>

        {isAddingNew && (
          <FAQForm
            onSave={handleSave}
            onCancel={() => setIsAddingNew(false)}
          />
        )}

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
              {editingFaq?.id === faq.id ? (
                <FAQForm
                  faq={editingFaq}
                  onSave={handleSave}
                  onCancel={() => setEditingFaq(null)}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {faq.answer}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Order: {faq.order_num}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleReorder(faq.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SafeIcon icon={FiChevronUp} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(faq.id, 'down')}
                        disabled={index === faqs.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SafeIcon icon={FiChevronDown} className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
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

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No FAQs found. Add your first FAQ to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FAQManager