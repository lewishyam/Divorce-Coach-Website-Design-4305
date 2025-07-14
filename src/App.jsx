import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import PrivacyPage from './pages/PrivacyPage'
import FAQPage from './pages/FAQPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import Footer from './components/Footer'
import BookingModal from './components/BookingModal'

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="*" element={
                <>
                  <Navigation />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <BookingModal />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App