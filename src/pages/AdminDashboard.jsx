import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

// Import admin components
import HeroEditor from '../components/admin/HeroEditor'
import IntroEditor from '../components/admin/IntroEditor'
import ContentBlockEditor from '../components/admin/ContentBlockEditor'
import ServicesManager from '../components/admin/ServicesManager'
import TestimonialsManager from '../components/admin/TestimonialsManager'
import CalendarEditor from '../components/admin/CalendarEditor'
import FooterEditor from '../components/admin/FooterEditor'
import LoginEditor from '../components/admin/LoginEditor'
import PrivacyEditor from '../components/admin/PrivacyEditor'
import FAQManager from '../components/admin/FAQManager'

const { FiHome, FiUser, FiEdit3, FiSettings, FiLogOut, FiCalendar, FiMessageSquare, FiHelpCircle, FiShield } = FiIcons

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero')
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: FiHome },
    { id: 'intro', label: 'Intro Section', icon: FiUser },
    { id: 'content', label: 'Content Blocks', icon: FiEdit3 },
    { id: 'services', label: 'Services', icon: FiSettings },
    { id: 'testimonials', label: 'Testimonials', icon: FiMessageSquare },
    { id: 'calendar', label: 'Calendar', icon: FiCalendar },
    { id: 'footer', label: 'Footer', icon: FiSettings },
    { id: 'login', label: 'Login Settings', icon: FiSettings },
    { id: 'privacy', label: 'Privacy Policy', icon: FiShield },
    { id: 'faq', label: 'FAQs', icon: FiHelpCircle }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroEditor />
      case 'intro':
        return <IntroEditor />
      case 'content':
        return <ContentBlockEditor />
      case 'services':
        return <ServicesManager />
      case 'testimonials':
        return <TestimonialsManager />
      case 'calendar':
        return <CalendarEditor />
      case 'footer':
        return <FooterEditor />
      case 'login':
        return <LoginEditor />
      case 'privacy':
        return <PrivacyEditor />
      case 'faq':
        return <FAQManager />
      default:
        return <HeroEditor />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Divorce with Direction
            </p>
          </div>

          <nav className="mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 w-64 p-6">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard